import React, { useMemo, useRef, useState } from "react";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function Complaints({ t, lang }) {
  const CATS = lang === "ar" ? ["شكوى", "اقتراح"] : ["Complaint", "Suggestion"];
  const [category, setCategory] = useState(CATS[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);

  const valid = useMemo(
    () =>
      subject.trim() &&
      message.trim() &&
      subject.length <= 200 &&
      message.length <= 2000,
    [subject, message]
  );

  function show(msg, err = false) {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 5000);
  }

  async function submit(e) {
    e.preventDefault();
    if (isSending) return;

    if (!valid) {
      show(
        lang === "ar"
          ? "الرجاء تعبئة العنوان والنص بشكل صحيح"
          : "Please fill subject and message correctly",
        true
      );
      return;
    }

    try {
      setIsSending(true);

      // 🔹 مرجع العداد داخل metadata_v2
      const counterRef = doc(db, "metadata_v2", "counters");
      let newComplaintNumber = null;

      await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        console.log("📊 Counter data:", counterDoc.data());

        if (!counterDoc.exists()) {
          throw new Error("⛔️ لم يتم العثور على مستند العداد metadata_v2/counters.");
        }

        const currentCount = counterDoc.data().complaintsCount || 0;
        newComplaintNumber = currentCount + 1;

        // ✅ إنشاء المستند في complaints باسم الرقم نفسه
        const newComplaintRef = doc(db, "complaints", newComplaintNumber.toString());

        transaction.set(newComplaintRef, {
          category,
          subject: subject.trim(),
          body: message.trim(),
          createdAt: serverTimestamp(),
          status: "new",
          complaintId: newComplaintNumber,
          ua: navigator.userAgent,
          anonymous: !!anonymous,
          name: anonymous || !name.trim() ? "مجهول" : name.trim(),
          studentId: anonymous || !studentId.trim() ? "مجهول" : studentId.trim(),
          email: anonymous || !email.trim() ? "مجهول" : email.trim(),
        });

        // ✅ تحديث العداد
        transaction.update(counterRef, {
          complaintsCount: newComplaintNumber,
        });

        console.log("✅ Transaction completed. Complaint number:", newComplaintNumber);
      });

      // ✅ إعادة ضبط الحقول بعد الإرسال
      setSubject("");
      setMessage("");
      setAnonymous(true);
      setName("");
      setStudentId("");
      setEmail("");

      // ✅ عرض رسالة نجاح
      show(
        lang === "ar"
          ? "تم إرسال الشكوى بنجاح ✅"
          : "Complaint submitted successfully ✅"
      );
      setTimeout(() => textareaRef.current?.focus(), 0);
    } catch (err) {
      console.error("⛔️ فشل في الحفظ أو الترقيم:", err);
      show(
        lang === "ar"
          ? `فشل الإرسال. تأكد من إعداد العداد والقواعد.`
          : "Failed to submit. Check counter setup and rules.",
        true
      );
    } finally {
      setIsSending(false);
    }
  }

  const charCountStyle = (current, max) => ({
    fontSize: "12px",
    color:
      current > max * 0.9
        ? "#ef4444"
        : current > max * 0.7
        ? "#f59e0b"
        : "#6b7280",
    textAlign: lang === "ar" ? "left" : "right",
    marginTop: "4px",
    fontWeight: "500",
    transition: "color 0.3s ease",
  });

  return (
    <div className="paper" style={{ marginTop: 20 }}>
      <div className="hd">{t.complaints}</div>
      <div className="bd">
        {toast && (
          <div className="toast">
            <div className={toast.err ? "err" : ""}>{toast.msg}</div>
          </div>
        )}

        <form className="form" onSubmit={submit} noValidate>
          {/* Category */}
          <div>
            <label>{lang === "ar" ? "النوع" : "Category"}</label>
            <div className="chips">
              {CATS.map((c, idx) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={"chip " + (category === c ? "active" : "")}
                  aria-pressed={category === c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label>{lang === "ar" ? "العنوان" : "Subject"}</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={
                lang === "ar" ? "عنوان مختصر وواضح" : "Short, meaningful subject"
              }
              maxLength={200}
            />
            <div style={charCountStyle(subject.length, 200)}>
              {subject.length} / 200
            </div>
          </div>

          {/* Message */}
          <div>
            <label>{lang === "ar" ? "النص" : "Message"}</label>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                lang === "ar"
                  ? "اكتب التفاصيل بشكل واضح..."
                  : "Please describe the issue in detail..."
              }
              maxLength={2000}
              rows={6}
              style={{ resize: "vertical", minHeight: "120px" }}
            />
            <div style={charCountStyle(message.length, 2000)}>
              {message.length} / 2000
            </div>
          </div>

          {/* Anonymous */}
          <div
            style={{
              background: "#F9FAFB",
              padding: 16,
              borderRadius: 12,
              border: "2px solid #E5E7EB",
            }}
          >
            <div className="checkbox">
              <input
                id="anon"
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <label
                htmlFor="anon"
                style={{
                  textTransform: "none",
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                {lang === "ar" ? "إرسال بدون اسم" : "Submit anonymously"}
              </label>
            </div>
          </div>

          {/* Contact */}
          {!anonymous && (
            <div
              style={{
                display: "grid",
                gap: 16,
                padding: 20,
                background: "#F9FAFB",
                borderRadius: 12,
                border: "2px solid #E5E7EB",
              }}
            >
              <label>{lang === "ar" ? "الاسم" : "Name"}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
              <label>{lang === "ar" ? "الرقم الجامعي" : "Student ID"}</label>
              <input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <label>
                {lang === "ar" ? "البريد الجامعي" : "University Email"}
              </label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          )}

          <button className="btn" type="submit" aria-disabled={isSending}>
            {isSending
              ? lang === "ar"
                ? "جارٍ الإرسال..."
                : "Sending..."
              : lang === "ar"
              ? "إرسال"
              : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
