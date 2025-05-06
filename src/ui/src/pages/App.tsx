import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Database, BrainCircuit, Workflow, Languages } from "lucide-react"; // Using lucide-react icons

// Define text content for different languages
const content = {
  en: {
    title: "SyncSage",
    login: "Login",
    signup: "Sign Up",
    heroHeadline: "Unified Data & AI Model Management",
    heroSubheadline: "SyncSage empowers data scientists and AI engineers to seamlessly manage data connections, AI models, and complex workflows, all from one intuitive platform.",
    getStarted: "Get Started",
    featuresTitle: "Key Features",
    feature1Title: "Data Connectors",
    feature1Desc: "Manage connections to Vector, JSON, MongoDB, SQLite, Supabase, and more.",
    feature1Details: "Effortlessly add, edit, and monitor all your data sources.",
    feature2Title: "Model Management",
    feature2Desc: "Organize PyTorch, TensorFlow, and JAX models. Get AI-powered recommendations.",
    feature2Details: "Upload, compare performance, and keep your models synchronized.",
    feature3Title: "Visual Automations",
    feature3Desc: "Build complex AI workflows with a drag-and-drop interface.",
    feature3Details: "Automate data loading, training, inference, and notifications.",
    problemTitle: "Stop Juggling Tools",
    problemDesc: "Tired of scattered data sources, version control nightmares for models, and manually orchestrating complex AI pipelines? SyncSage brings everything together, streamlining your workflow and boosting productivity.",
    visualTitle: "See It In Action",
    visualPlaceholder: "[Placeholder for Dashboard Visual/Screenshot]", // This text won't be visible with the new placeholder
    ctaTitle: "Ready to Streamline Your AI Workflow?",
    ctaDesc: "Sign up today and take control of your data and models.",
    ctaSignup: "Sign Up Now",
    footerText: "© {year} SyncSage. All rights reserved.",
  },
  ar: {
    title: "سينك سيج", // SyncSage
    login: "تسجيل الدخول", // Login
    signup: "إنشاء حساب", // Sign Up
    heroHeadline: "إدارة موحدة للبيانات ونماذج الذكاء الاصطناعي", // Unified Data & AI Model Management
    heroSubheadline: "تمكّن SyncSage علماء البيانات ومهندسي الذكاء الاصطناعي من إدارة اتصالات البيانات ونماذج الذكاء الاصطناعي وسير العمل المعقد بسلاسة، كل ذلك من منصة واحدة سهلة الاستخدام.", // SyncSage empowers...
    getStarted: "ابدأ الآن", // Get Started
    featuresTitle: "الميزات الرئيسية", // Key Features
    feature1Title: "موصلات البيانات", // Data Connectors
    feature1Desc: "إدارة الاتصالات بـ Vector، JSON، MongoDB، SQLite، Supabase، والمزيد.", // Manage connections...
    feature1Details: "أضف وحرر وراقب جميع مصادر بياناتك بسهولة.", // Effortlessly add...
    feature2Title: "إدارة النماذج", // Model Management
    feature2Desc: "نظّم نماذج PyTorch و TensorFlow و JAX. احصل على توصيات مدعومة بالذكاء الاصطناعي.", // Organize PyTorch...
    feature2Details: "حمّل وقارن الأداء وحافظ على مزامنة نماذجك.", // Upload, compare...
    feature3Title: "الأتمتة المرئية", // Visual Automations
    feature3Desc: "أنشئ سير عمل معقد للذكاء الاصطناعي بواجهة سحب وإفلات.", // Build complex AI...
    feature3Details: "أتمتة تحميل البيانات والتدريب والاستدلال والإشعارات.", // Automate data loading...
    problemTitle: "توقف عن التلاعب بالأدوات", // Stop Juggling Tools
    problemDesc: "هل سئمت من مصادر البيانات المتناثرة وكوابيس التحكم في إصدار النماذج وتنظيم خطوط أنابيب الذكاء الاصطناعي المعقدة يدويًا؟ يجمع SyncSage كل شيء معًا، مما يبسط سير عملك ويعزز الإنتاجية.", // Tired of scattered...
    visualTitle: "شاهدها قيد التشغيل", // See It In Action
    visualPlaceholder: "[عنصر نائب للصورة المرئية للوحة المعلومات / لقطة شاشة]", // Placeholder...
    ctaTitle: "هل أنت مستعد لتبسيط سير عمل الذكاء الاصطناعي الخاص بك؟", // Ready to Streamline...
    ctaDesc: "سجل اليوم وتحكم في بياناتك ونماذجك.", // Sign up today...
    ctaSignup: "سجل الآن", // Sign Up Now
    footerText: "© {year} سينك سيج. جميع الحقوق محفوظة.", // © {year} SyncSage...
  },
};


export default function App() {
  const navigate = useNavigate(); // Initialize navigate function
  const [language, setLanguage] = useState<"en" | "ar">("en"); // Default to English

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const t = content[language]; // Get text content for the current language
  const dir = language === "ar" ? "rtl" : "ltr"; // Set directionality


  return (
    <div className={`flex flex-col min-h-screen bg-background text-foreground ${dir === 'rtl' ? 'rtl' : ''}`} dir={dir}>
      {/* Header/Nav Placeholder */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center mx-auto px-4">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              {/* <Icons.logo className="h-6 w-6" /> */}{/* Placeholder for potential logo */}
              <span className="hidden font-bold sm:inline-block">{t.title}</span>
            </a>
            {/* Future Nav Links can go here */}
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Languages className="h-5 w-5" />
              <span className="sr-only">Toggle Language</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/Login")}>{t.login}</Button>
            <Button onClick={() => navigate("/Signup")}>{t.signup}</Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
            {t.heroHeadline}
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto mb-10">
            {t.heroSubheadline}
          </p>
          <Button size="lg" onClick={() => navigate("/Signup")}>
            {t.getStarted} <ArrowRight className="ms-2 h-5 w-5" />
          </Button>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 border-t border-border/40">
          <h3 className="text-3xl font-bold text-center mb-16">{t.featuresTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Database className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">{t.feature1Title}</h4>
              <p className="text-muted-foreground">{t.feature1Desc}</p>
              {/* <p className="text-sm text-muted-foreground/80 mt-1">{t.feature1Details}</p> */} {/* Optional more details */}
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">{t.feature2Title}</h4>
              <p className="text-muted-foreground">{t.feature2Desc}</p>
              {/* <p className="text-sm text-muted-foreground/80 mt-1">{t.feature2Details}</p> */}
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Workflow className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2">{t.feature3Title}</h4>
              <p className="text-muted-foreground">{t.feature3Desc}</p>
              {/* <p className="text-sm text-muted-foreground/80 mt-1">{t.feature3Details}</p> */}
            </div>
          </div>
        </section>

        {/* Problem Solved Section */}
        <section className="container mx-auto px-4 py-20 text-center border-t border-border/40">
          <h3 className="text-3xl font-bold mb-6">{t.problemTitle}</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t.problemDesc}
          </p>
        </section>

        {/* Visual Mockup Placeholder */}
        <section className="container mx-auto px-4 py-20 border-t border-border/40">
          <h3 className="text-3xl font-bold text-center mb-12">{t.visualTitle}</h3>
          <div className="bg-muted/40 border border-border rounded-lg p-4 h-[450px] flex overflow-hidden shadow-lg">
            {/* Simplified Sidebar */}
            <div className="w-1/4 bg-background/50 rounded-s-md p-4 me-4 space-y-3">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mt-6"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
            {/* Simplified Content Area */}
            <div className="w-3/4 bg-background/30 rounded-e-md p-4 space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-28 bg-muted rounded"></div>
                <div className="h-28 bg-muted rounded"></div>
                <div className="h-28 bg-muted rounded"></div>
                <div className="h-28 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication/Footer Section */}
        <section className="container mx-auto px-4 py-20 text-center border-t border-border/40">
          <h3 className="text-3xl font-bold mb-4">{t.ctaTitle}</h3>
          <p className="text-lg text-muted-foreground mb-8">{t.ctaDesc}</p>
          <div className="space-x-3 rtl:space-x-reverse">
            <Button variant="outline" onClick={() => navigate("/Login")}>{t.login}</Button>
            <Button size="lg" onClick={() => navigate("/Signup")}>{t.ctaSignup}</Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t.footerText.replace('{year}', new Date().getFullYear().toString())}
          </p>
          {/* Add social links or other footer content here if needed */}
        </div>
      </footer>
    </div>
  );
}
