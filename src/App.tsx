import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from './store/useStore';
import './style.css';
import LandingPage from './LandingPage';

const headerThemes = [
  { value: 'blue', label: 'الهيدر الأزرق الملكي ' },
    { value: 'navy', label: 'الهيدر الوردي' }, 
  { value: 'royal-blue', label: 'الهيدر الأزرق الداكن' },
  { value: 'maroon', label: 'الهيدر النبيتي الملكي ' },
    { value: 'emerald', label: 'الهيدر البنفسجي' },
  { value: 'classic-school', label: 'الهيدر الرمادي ' },
  { value: 'arabic-art', label: 'الهيدر الديواني' },
  { value: 'gold', label: 'الهيدر الذهبي' },
  { value: 'simple', label: 'الهيدر الأبيض ' }
];
import toast, { Toaster } from 'react-hot-toast';
export default function App() {
  // استخدام درجات من المخزن الدائم
  const { settings, setSettings, setStudentsData, studentsData } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [headerTheme, setHeaderTheme] = useState("blue");
  const [isStarted, setIsStarted] = useState(false);
const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMessage(null);
    setStudentsData([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://noormark-backend-production.up.railway.app/api/upload", formData);
      
      if (response.data && response.data.data) {
         const { students, className } = response.data.data;
         setStudentsData(students);
         setSettings({ className: className }); // حفظ اسم الصف المستخرج من الإكسيل
         toast.success('تم استخراج البيانات بنجاح  🎉');
         setUploadedFileName(file.name);
      } else {
         setErrorMessage("الملف فارغ أو لا يحتوي على بيانات صحيحة.");
      }
    } catch (error: any) {
      setErrorMessage("حصلت مشكلة في الاتصال بالسيرفر. تأكد أن السيرفر يعمل.");
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };
  // إذا لم يضغط المستخدم على زر البداية، اعرض الشاشة الافتتاحية فقط
  if (!isStarted) {
    return <LandingPage onEnter={() => setIsStarted(true)} />;
  }

  return (
    <div dir="rtl" className={headerTheme}>
       {/* أضف المكون هنا مباشرة بعد فتح الـ div الرئيسي */}
       <Toaster /> 

       <div className="toolbar no-print">
          <label className="custom-file-upload">
              {isLoading ? "⏳ جارٍ المعالجة..." : uploadedFileName ? `📄 ${uploadedFileName}` : "📂 اختر ملف الإكسيل"}
              <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} disabled={isLoading} style={{ display: 'none' }} />
          </label>
          
          <input type="text" placeholder="اسم المادة" value={settings.subject} onChange={(e) => setSettings({ subject: e.target.value })} />
          <input type="text" placeholder="الصف" value={settings.className} onChange={(e) => setSettings({ className: e.target.value })} />
          
          <select value={settings.term} onChange={(e) => setSettings({ term: e.target.value })}>
              <option value="الأول">الفصل الدراسي الأول</option>
              <option value="الثاني">الفصل الدراسي الثاني</option>
          </select>
          
          <input type="text" placeholder="العام الدراسي" value={settings.year} onChange={(e) => setSettings({ year: e.target.value })} />
          <input type="text" placeholder="اسم المعلم /ة" value={settings.teacher} onChange={(e) => setSettings({ teacher: e.target.value })} />
          <input type="text" placeholder="اسم مدير المدرسة /ة" value={settings.principal} onChange={(e) => setSettings({ principal: e.target.value })} />
          <select onChange={(e) => setHeaderTheme(e.target.value)} value={headerTheme}>
              {headerThemes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          
          <button onClick={() => window.print()}>طباعة كـ PDF احترافي</button>
       </div>

       {isLoading && <div style={{ textAlign: 'center', padding: '10px', color: '#1e3a8a', fontWeight: 'bold' }}>⏳ جارٍ المعالجة...</div>}
       {errorMessage && <div style={{ textAlign: 'center', color: '#dc2626', padding: '10px' }}>⚠️ {errorMessage}</div>}

       <div className="page" id="printArea">
          <div className={`header ${headerTheme}`}>
                            <h1>كشف درجات مادة <span>{settings.subject}</span></h1> 
              <p>الصف: <span>{settings.className}</span> | الفصل الدراسي: <span>{settings.term}</span> | العام الدراسي: <span>{settings.year}</span></p>           </div>

          <table id="gradeTable">
              <thead>
                  <tr>
                      <th width="10%">م</th>
                      <th width="60%">اسم الطالب / ة</th>
                      <th width="30%">المجموع</th>
                  </tr>
              </thead>
              <tbody>
                  {studentsData.map((student: any) => (
                      <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>
                              {/* تعديل عرض الدرجة: بنقص النص عند علامة / وبناخد أول جزء فقط */}
                              {String(student.score).split('/')[0]}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>

          <div className="signatures">
              <div><div>توقيع معلم المادة</div><div className="sign-name">{settings.teacher}</div></div>
              <div><div>يعتمد ، مدير المدرسة</div><div className="sign-name">{settings.principal}</div></div>
          </div>
       </div>
    </div>
  );
}