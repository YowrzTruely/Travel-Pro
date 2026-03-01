import svgPaths from "./svg-1n36bxrhr2";

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[59.27px]">
        <p className="leading-[16px] whitespace-pre-wrap">סטטוס מסמך</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-right text-white w-[111.7px]">
        <p className="leading-[24px] whitespace-pre-wrap">מאושר לאפיון טכני</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p24991e60} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#f97316] content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0" data-name="Background">
      <Svg />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.99px] items-center relative">
        <Container2 />
        <Background />
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col items-start p-[17px] relative rounded-[12px] shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container1 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[40px] justify-center leading-[0] relative shrink-0 text-[36px] text-right text-white w-[543.2px]">
        <p className="leading-[40px] whitespace-pre-wrap">מפרט MVP - מערכת ניהול הצעות מחיר</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[28px] justify-center leading-[0] relative shrink-0 text-[#cbd5e1] text-[18px] text-right w-[367.53px]">
        <p className="leading-[28px] whitespace-pre-wrap">TravelPro SaaS - פלטפורמה למפיקי טיולים ונופש עסקי</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Container">
      <Heading />
      <Container6 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-center justify-between max-w-[1152px] relative shrink-0 w-full" data-name="Container">
      <OverlayBorderOverlayBlur />
      <Container5 />
    </div>
  );
}

function MainHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="MainHeader" style={{ backgroundImage: "linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(15, 23, 42) 100%)" }}>
      <div className="content-stretch flex flex-col items-start px-[64px] py-[48px] relative w-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="MainHeader:shadow" />
        <Container />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[24px] text-right w-[271.11px]">
        <p className="leading-[32px] whitespace-pre-wrap">מטרות על (Strategic Goals)</p>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p48d5200} id="Vector" stroke="var(--stroke-0, #EA580C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#ffedd5] content-stretch flex flex-col items-start p-[8px] relative rounded-[9999px] shrink-0" data-name="Background">
      <Svg1 />
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[780.89px] relative w-full">
          <Heading1 />
          <Background1 />
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[18px] text-right w-[138.67px]">
          <p className="leading-[28px] whitespace-pre-wrap">תמחור חכם ורווחיות</p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[52px] justify-center leading-[26px] relative shrink-0 text-[#475569] text-[16px] text-right w-[285.28px] whitespace-pre-wrap">
          <p className="mb-0">שקיפות מלאה על שולי הרווח בכל רכיב, עם מנגנון</p>
          <p>משקולות (1-5) לניהול סיכונים ורווח.</p>
        </div>
      </div>
    </div>
  );
}

function Goal2() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] self-stretch" data-name="Goal 3">
      <div aria-hidden="true" className="absolute border-[#f97316] border-solid border-t-4 inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[28px] px-[24px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[16px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Goal 3:shadow" />
        <Heading2 />
        <Container9 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[18px] text-right w-[146.25px]">
          <p className="leading-[28px] whitespace-pre-wrap">{`ניהול בנק ספקים 'חי'`}</p>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[52px] justify-center leading-[26px] relative shrink-0 text-[#475569] text-[16px] text-right w-[278.81px] whitespace-pre-wrap">
          <p className="mb-0">עדכון מוצרים וספקים תוך כדי עבודה על פרויקט,</p>
          <p>שמירה על מאגר עדכני ונגיש לכל הצוות.</p>
        </div>
      </div>
    </div>
  );
}

function Goal1() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] self-stretch" data-name="Goal 2">
      <div aria-hidden="true" className="absolute border-[#f97316] border-solid border-t-4 inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[28px] px-[24px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[16px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Goal 2:shadow" />
        <Heading3 />
        <Container10 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[18px] text-right w-[137.06px]">
          <p className="leading-[28px] whitespace-pre-wrap">בניית הצעות מהירה</p>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[78px] justify-center leading-[26px] relative shrink-0 text-[#475569] text-[16px] text-right w-[277.91px] whitespace-pre-wrap">
          <p className="mb-0">קיצור זמן הפקת הצעה מ-3 שעות ל-15 דקות</p>
          <p className="mb-0">באמצעות אוטומציה של חישובים ותבניות מוכנות</p>
          <p>מראש.</p>
        </div>
      </div>
    </div>
  );
}

function Goal() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] self-stretch" data-name="Goal 1">
      <div aria-hidden="true" className="absolute border-[#f97316] border-solid border-t-4 inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[28px] px-[24px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[16px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Goal 1:shadow" />
        <Heading4 />
        <Container11 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Goal2 />
      <Goal1 />
      <Goal />
    </div>
  );
}

function SectionStrategicGoals() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Section - StrategicGoals">
      <Container7 />
      <Container8 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[24px] text-right w-[276.69px]">
        <p className="leading-[32px] whitespace-pre-wrap">מסכי ה-MVP (Core Screens)</p>
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p2787e620} id="Vector" stroke="var(--stroke-0, #2563EB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#dbeafe] content-stretch flex flex-col items-start p-[8px] relative rounded-[9999px] shrink-0" data-name="Background">
      <Svg2 />
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[711.31px] relative w-full">
          <Heading5 />
          <Background2 />
        </div>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[149.94px]">
        <p className="leading-[24px] whitespace-pre-wrap">לוח בקרה (Dashboard)</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[40px] justify-center leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-right w-[254.34px] whitespace-pre-wrap">
        <p className="mb-0">סקירת פרויקטים פתוחים, התראות על מסמכים פגי</p>
        <p>תוקף וסטטיסטיקות עבודה.</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative self-stretch shrink-0" data-name="Container">
      <Heading6 />
      <Container15 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Container">
      <div className="h-[13.19px] relative shrink-0 w-[18.45px]" data-name="Icon">
        <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18.4501 13.19">
          <path d={svgPaths.p2fd2de00} fill="var(--fill-0, #F97316)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function ScreenItem() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-start left-[714.67px] p-[16px] right-0 rounded-[12px] top-0" data-name="Screen Item">
      <Container14 />
      <Container16 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[195.59px]">
        <p className="leading-[24px] whitespace-pre-wrap">פרויקט ותמחור (Quote Editor)</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[40px] justify-center leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-right w-[210.11px] whitespace-pre-wrap">
        <p className="mb-0">ניהול רכיבי הטיול (תחבורה, לינה, פעילות)</p>
        <p>וטבלאות רווחיות דינמיות.</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative self-stretch shrink-0" data-name="Container">
      <Heading7 />
      <Container18 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#f97316] text-[20px] text-right w-[20.92px]">
        <p className="leading-[28px] whitespace-pre-wrap">02</p>
      </div>
    </div>
  );
}

function ScreenItem1() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-start left-[357.34px] p-[16px] right-[357.33px] rounded-[12px] top-0" data-name="Screen Item">
      <Container17 />
      <Container19 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[181.48px]">
        <p className="leading-[24px] whitespace-pre-wrap">בנק ספקים (Supplier Bank)</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[40px] justify-center leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-right w-[255.42px] whitespace-pre-wrap">
        <p className="mb-0">ניהול מרכזי של כלל הספקים עם סינון לפי קטגוריה,</p>
        <p>אזור ודירוג.</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative self-stretch shrink-0" data-name="Container">
      <Heading8 />
      <Container21 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#f97316] text-[20px] text-right w-[20.92px]">
        <p className="leading-[28px] whitespace-pre-wrap">03</p>
      </div>
    </div>
  );
}

function ScreenItem2() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-start left-0 p-[16px] right-[714.66px] rounded-[12px] top-0" data-name="Screen Item">
      <Container20 />
      <Container22 />
    </div>
  );
}

function Heading9() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[187.86px]">
        <p className="leading-[24px] whitespace-pre-wrap">כרטיס ספק (Supplier Detail)</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[40px] justify-center leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-right w-[239.88px] whitespace-pre-wrap">
        <p className="mb-0">פרטי קשר, אנשי קשר, מוצרים מוצעים ומסמכים</p>
        <p>רגולטוריים (ביטוח/רישיון).</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative self-stretch shrink-0" data-name="Container">
      <Heading9 />
      <Container24 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#f97316] text-[20px] text-right w-[20.92px]">
        <p className="leading-[28px] whitespace-pre-wrap">04</p>
      </div>
    </div>
  );
}

function ScreenItem3() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-start left-[714.67px] p-[16px] right-0 rounded-[12px] top-[132px]" data-name="Screen Item">
      <Container23 />
      <Container25 />
    </div>
  );
}

function Heading10() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[175.52px]">
        <p className="leading-[24px] whitespace-pre-wrap">תצוגת לקוח (Client Quote)</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[40px] justify-center leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-right w-[219.47px] whitespace-pre-wrap">
        <p className="mb-0">עמוד נחיתה מעוצב ללקוח הקצה המציג את</p>
        <p>תוכנית הטיול והמחיר הסופי.</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative self-stretch shrink-0" data-name="Container">
      <Heading10 />
      <Container27 />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#f97316] text-[20px] text-right w-[20.92px]">
        <p className="leading-[28px] whitespace-pre-wrap">05</p>
      </div>
    </div>
  );
}

function ScreenItem4() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-start left-[357.34px] p-[16px] right-[357.33px] rounded-[12px] top-[132px]" data-name="Screen Item">
      <Container26 />
      <Container28 />
    </div>
  );
}

function Heading11() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[220.47px]">
        <p className="leading-[24px] whitespace-pre-wrap">אשף סיווג (Classification Wizard)</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[40px] justify-center leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-right w-[243.81px] whitespace-pre-wrap">
        <p className="mb-0">מנגנון מהיר להוספה וסיווג ספקים חדשים למאגר</p>
        <p>המערכת.</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative self-stretch shrink-0" data-name="Container">
      <Heading11 />
      <Container30 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#f97316] text-[20px] text-right w-[20.92px]">
        <p className="leading-[28px] whitespace-pre-wrap">06</p>
      </div>
    </div>
  );
}

function ScreenItem5() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-start left-0 p-[16px] right-[714.66px] rounded-[12px] top-[132px]" data-name="Screen Item">
      <Container29 />
      <Container31 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[232px] relative shrink-0 w-full" data-name="Container">
      <ScreenItem />
      <ScreenItem1 />
      <ScreenItem2 />
      <ScreenItem3 />
      <ScreenItem4 />
      <ScreenItem5 />
    </div>
  );
}

function SectionMvpScreens() {
  return (
    <div className="bg-white relative rounded-[24px] shrink-0 w-full" data-name="Section - MVPScreens">
      <div className="content-stretch flex flex-col gap-[32px] items-start p-[32px] relative w-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[24px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Section - MVPScreens:shadow" />
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p147020c0} id="Vector" stroke="var(--stroke-0, #FB923C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Heading12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[197.64px] relative w-full">
          <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[24px] text-right text-white w-[238.36px]">
            <p className="leading-[32px] whitespace-pre-wrap">ישויות מרכזיות (Entities)</p>
          </div>
          <Svg3 />
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#fb923c] text-[16px] text-right w-[50.31px]">
          <p className="leading-[24px] whitespace-pre-wrap">Project</p>
        </div>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[40px] justify-center leading-[20px] relative shrink-0 text-[#cbd5e1] text-[14px] text-right w-[151.59px] whitespace-pre-wrap">
          <p className="mb-0">פרויקט/טיול הכולל לוח זמנים,</p>
          <p>משתתפים ותקציב.</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col gap-[4px] items-start left-[244px] p-[17px] right-0 rounded-[12px] top-0" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container34 />
      <Container35 />
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#fb923c] text-[16px] text-right w-[59.44px]">
          <p className="leading-[24px] whitespace-pre-wrap">Supplier</p>
        </div>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[40px] justify-center leading-[20px] relative shrink-0 text-[#cbd5e1] text-[14px] text-right w-[165.17px] whitespace-pre-wrap">
          <p className="mb-0">ישות משפטית המספקת שירותים</p>
          <p>(חברה/עוסק).</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col gap-[4px] items-start left-0 p-[17px] right-[244px] rounded-[12px] top-0" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container36 />
      <Container37 />
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#fb923c] text-[16px] text-right w-[55.88px]">
          <p className="leading-[24px] whitespace-pre-wrap">Product</p>
        </div>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[40px] justify-center leading-[20px] relative shrink-0 text-[#cbd5e1] text-[14px] text-right w-[175.86px] whitespace-pre-wrap">
          <p className="mb-0">{`שירות ספציפי (למשל: "אוטובוס 50`}</p>
          <p>{`מקומות").`}</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder2() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col gap-[4px] items-start left-[244px] p-[17px] right-0 rounded-[12px] top-[118px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container38 />
      <Container39 />
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#fb923c] text-[16px] text-right w-[42.36px]">
          <p className="leading-[24px] whitespace-pre-wrap">Quote</p>
        </div>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[40px] justify-center leading-[20px] relative shrink-0 text-[#cbd5e1] text-[14px] text-right w-[176.77px] whitespace-pre-wrap">
          <p className="mb-0">הצעת מחיר הכוללת תמחור רכיבים</p>
          <p>וסיכומי רווח.</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder3() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col gap-[4px] items-start left-0 p-[17px] right-[244px] rounded-[12px] top-[118px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container40 />
      <Container41 />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[220px] relative shrink-0 w-full" data-name="Container">
      <OverlayBorder />
      <OverlayBorder1 />
      <OverlayBorder2 />
      <OverlayBorder3 />
    </div>
  );
}

function SectionEntities() {
  return (
    <div className="bg-[#0f172a] flex-[1_0_0] min-h-px min-w-px relative rounded-[24px] self-stretch" data-name="Section - Entities">
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[32px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[24px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Section - Entities:shadow" />
        <Heading12 />
        <Container33 />
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p156ae100} id="Vector" stroke="var(--stroke-0, #F97316)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Heading13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pl-[127.09px] relative w-full">
          <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[24px] text-right w-[304.91px]">
            <p className="leading-[32px] whitespace-pre-wrap">לוגיקה עסקית (Business Logic)</p>
          </div>
          <Svg4 />
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[48px] leading-[0] relative shrink-0 text-[#334155] text-[16px] text-right w-[448px]" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center right-0 top-[11.5px] w-[90.47px]">
        <p className="leading-[24px] whitespace-pre-wrap">משקולות רווח:</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center right-[90.47px] top-[11.5px] w-[342.55px]">
        <p className="leading-[24px] whitespace-pre-wrap">{` לכל ספק/מוצר מוצמד דירוג 1-5 הקובע אוטומטית את אחוז`}</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center right-[-0.01px] top-[35.5px] w-[262.13px]">
        <p className="leading-[24px] whitespace-pre-wrap">הרווח המומלץ (למשל: 5 כוכבים = 25% רווח).</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col h-[14px] items-start pt-[6px] relative shrink-0 w-[8px]" data-name="Margin">
      <div className="bg-[#f97316] rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Item">
      <Paragraph />
      <Margin />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[48px] leading-[0] relative shrink-0 text-[#334155] text-[16px] text-right w-[448px]" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center right-0 top-[11.5px] w-[88.27px]">
        <p className="leading-[24px] whitespace-pre-wrap">סיווג אוטומטי:</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center right-[88.26px] top-[11.5px] w-[356.91px]">
        <p className="leading-[24px] whitespace-pre-wrap">{` זיהוי אוטומטי של סוג השירות (הסעות/קייטרינג/אטרקציה) לפי`}</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center right-0 top-[35.5px] w-[161.44px]">
        <p className="leading-[24px] whitespace-pre-wrap">מילות מפתח בתיאור הספק.</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col h-[14px] items-start pt-[6px] relative shrink-0 w-[8px]" data-name="Margin">
      <div className="bg-[#f97316] rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Item">
      <Paragraph1 />
      <Margin1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[48px] leading-[0] relative shrink-0 text-[#334155] text-[16px] text-right w-[448px]" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center right-0 top-[11.5px] w-[200.22px]">
        <p className="leading-[24px] whitespace-pre-wrap">משיכת נתונים (Web Scraping):</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center right-[200.22px] top-[11.5px] w-[221.7px]">
        <p className="leading-[24px] whitespace-pre-wrap">{` יכולת בסיסית לשאוב תמונות ותיאורים`}</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center right-0 top-[35.5px] w-[248.75px]">
        <p className="leading-[24px] whitespace-pre-wrap">מאתרי ספקים חיצוניים לתוך כרטיס המוצר.</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col h-[14px] items-start pt-[6px] relative shrink-0 w-[8px]" data-name="Margin">
      <div className="bg-[#f97316] rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Item">
      <Paragraph2 />
      <Margin2 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[48px] leading-[0] relative shrink-0 text-[#334155] text-[16px] text-right w-[448px]" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center right-0 top-[11.5px] w-[87.84px]">
        <p className="leading-[24px] whitespace-pre-wrap">ניהול גרסאות:</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center right-[87.84px] top-[11.5px] w-[356.5px]">
        <p className="leading-[24px] whitespace-pre-wrap">{` שמירת היסטוריית שינויים לכל הצעת מחיר למעקב אחרי מו"מ`}</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center right-0 top-[35.5px] w-[70.22px]">
        <p className="leading-[24px] whitespace-pre-wrap">מול לקוחות.</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col h-[14px] items-start pt-[6px] relative shrink-0 w-[8px]" data-name="Margin">
      <div className="bg-[#f97316] rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
    </div>
  );
}

function Item3() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Item">
      <Paragraph3 />
      <Margin3 />
    </div>
  );
}

function List() {
  return (
    <div className="relative shrink-0 w-full" data-name="List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative w-full">
        <Item />
        <Item1 />
        <Item2 />
        <Item3 />
      </div>
    </div>
  );
}

function SectionBusinessLogic() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[24px] self-stretch" data-name="Section - BusinessLogic">
      <div aria-hidden="true" className="absolute border-[#f97316] border-r-4 border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start pl-[32px] pr-[36px] py-[32px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[24px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Section - BusinessLogic:shadow" />
        <Heading13 />
        <List />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[32px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <SectionEntities />
      <SectionBusinessLogic />
    </div>
  );
}

function Heading14() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[24px] text-right w-[313.16px]">
        <p className="leading-[32px] whitespace-pre-wrap">הנחיות עיצוב (UI/UX Principles)</p>
      </div>
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p22cfe480} id="Vector" stroke="var(--stroke-0, #9333EA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#f3e8ff] content-stretch flex flex-col items-start p-[8px] relative rounded-[9999px] shrink-0" data-name="Background">
      <Svg5 />
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pl-[674.84px] relative w-full">
          <Heading14 />
          <Background3 />
        </div>
      </div>
    </div>
  );
}

function Heading15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[141.39px]">
          <p className="leading-[24px] whitespace-pre-wrap">נגישות וחוויית משתמש</p>
        </div>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[60px] justify-center leading-[20px] relative shrink-0 text-[#475569] text-[14px] text-right w-[267.41px] whitespace-pre-wrap">
          <p className="mb-0">ניגודיות גבוהה בטבלאות נתונים, מצבי סטטוס ברורים</p>
          <p className="mb-0">(פעיל/ממתין/פג תוקף) וניווט צידי (Sidebar) קבוע</p>
          <p>להתמצאות קלה.</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-[250px] relative rounded-[16px] self-stretch" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start min-w-[inherit] p-[21px] relative size-full">
        <Heading15 />
        <Container44 />
      </div>
    </div>
  );
}

function Heading16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[125.63px]">
          <p className="leading-[24px] whitespace-pre-wrap">תמיכה מלאה ב-RTL</p>
        </div>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[60px] justify-center leading-[20px] relative shrink-0 text-[#475569] text-[14px] text-right w-[293.97px] whitespace-pre-wrap">
          <p className="mb-0">{`יישור לימין של כל רכיבי הממשק, שימוש בפונט 'Assistant'`}</p>
          <p className="mb-0">קריא ומודרני, התאמה לפורמט תאריכים ומטבע מקומי</p>
          <p>(₪).</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-[250px] relative rounded-[16px] self-stretch" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start min-w-[inherit] p-[21px] relative size-full">
        <Heading16 />
        <Container45 />
      </div>
    </div>
  );
}

function Heading17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[158.84px]">
          <p className="leading-[24px] whitespace-pre-wrap">אסתטיקה מעולם התיירות</p>
        </div>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[60px] justify-center leading-[20px] relative shrink-0 text-[#475569] text-[14px] text-right w-[273.94px] whitespace-pre-wrap">
          <p className="mb-0">שימוש בצבעי כתום (אנרגיה), כחול עמוק (אמינות) ולבן</p>
          <p className="mb-0">נקי. תמונות רקע של נופים ואייקונים מעולם התחבורה</p>
          <p>והפנאי.</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-[250px] relative rounded-[16px] self-stretch" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start min-w-[inherit] p-[21px] relative size-full">
        <Heading17 />
        <Container46 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start justify-center relative w-full">
        <BackgroundBorder />
        <BackgroundBorder1 />
        <BackgroundBorder2 />
      </div>
    </div>
  );
}

function SectionDesignGuidelines() {
  return (
    <div className="bg-white relative rounded-[24px] shrink-0 w-full" data-name="Section - DesignGuidelines">
      <div aria-hidden="true" className="absolute border-[#f97316] border-b-8 border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[40px] pt-[32px] px-[32px] relative w-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[24px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Section - DesignGuidelines:shadow" />
        <Container42 />
        <Container43 />
      </div>
    </div>
  );
}

function Main() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start max-w-[1152px] pb-[40px] px-[24px] relative shrink-0 w-[1152px]" data-name="Main">
      <SectionStrategicGoals />
      <SectionMvpScreens />
      <Container32 />
      <SectionDesignGuidelines />
    </div>
  );
}

function Heading18() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[24px] text-right w-[300.3px]">
        <p className="leading-[32px] whitespace-pre-wrap">דגשים לעיצוב מובייל (דף הצעה)</p>
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p2bc7c260} id="Vector" stroke="var(--stroke-0, #16A34A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#dcfce7] content-stretch flex flex-col items-start p-[8px] relative rounded-[9999px] shrink-0" data-name="Background">
      <Svg6 />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[927.7px] relative w-full">
          <Heading18 />
          <Background4 />
        </div>
      </div>
    </div>
  );
}

function Heading19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[18px] text-right w-[103.27px]">
          <p className="leading-[28px] whitespace-pre-wrap">Sticky Footer</p>
        </div>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[46px] justify-center leading-[22.75px] relative shrink-0 text-[#475569] text-[14px] text-right w-[330.47px] whitespace-pre-wrap">
          <p className="mb-0">כפתור אישור הצעה ומחיר סופי חייבים להיות תמיד גלויים בתחתית</p>
          <p>המסך לגישה מהירה.</p>
        </div>
      </div>
    </div>
  );
}

function Point() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[7.375px] items-start left-[869.34px] pl-[24px] pr-[28px] py-[24px] right-0 rounded-[16px] top-0" data-name="Point 1">
      <div aria-hidden="true" className="absolute border-[#22c55e] border-r-4 border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0_0.88px_0] rounded-[16px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Point 1:shadow" />
      <Heading19 />
      <Container49 />
    </div>
  );
}

function Heading20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[18px] text-right w-[64.69px]">
          <p className="leading-[28px] whitespace-pre-wrap">{`לו"ז אנכי`}</p>
        </div>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[46px] justify-center leading-[22.75px] relative shrink-0 text-[#475569] text-[14px] text-right w-[329.37px] whitespace-pre-wrap">
          <p className="mb-0">{`הצגת הלו"ז כציר זמן ברור (Timeline) עם אייקונים מתאימים לכל`}</p>
          <p>פעילות להתאמה למסכים צרים.</p>
        </div>
      </div>
    </div>
  );
}

function Point1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[7.375px] items-start left-[434.67px] pl-[24px] pr-[28px] py-[24px] right-[434.66px] rounded-[16px] top-0" data-name="Point 2">
      <div aria-hidden="true" className="absolute border-[#22c55e] border-r-4 border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0_0.88px_0] rounded-[16px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Point 2:shadow" />
      <Heading20 />
      <Container50 />
    </div>
  );
}

function Heading21() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[18px] text-right w-[103.55px]">
          <p className="leading-[28px] whitespace-pre-wrap">תמונות ופריסה</p>
        </div>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[46px] justify-center leading-[22.75px] relative shrink-0 text-[#475569] text-[14px] text-right w-[355.36px] whitespace-pre-wrap">
          <p className="mb-0">פריסה של תמונה ברוחב מלא מעל הטקסט השיווקי (במקום 75/25) כדי</p>
          <p>למקסם קריאות וחוויה ויזואלית.</p>
        </div>
      </div>
    </div>
  );
}

function Point2() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[7.375px] items-start left-[0.02px] pl-[24px] pr-[28px] py-[24px] right-[869.32px] rounded-[16px] top-0" data-name="Point 3">
      <div aria-hidden="true" className="absolute border-[#22c55e] border-r-4 border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0_0.88px_0] rounded-[16px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Point 3:shadow" />
      <Heading21 />
      <Container51 />
    </div>
  );
}

function Heading22() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[18px] text-right w-[47.45px]">
          <p className="leading-[28px] whitespace-pre-wrap">נגישות</p>
        </div>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[46px] justify-center leading-[22.75px] relative shrink-0 text-[#475569] text-[14px] text-right w-[357.42px] whitespace-pre-wrap">
          <p className="mb-0">כפתורים גדולים (מינימום 44px גובה) ללחיצה קלה ומדויקת עם האגודל</p>
          <p>במכשירים ניידים.</p>
        </div>
      </div>
    </div>
  );
}

function Point3() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[7.375px] items-start left-[869.34px] pl-[24px] pr-[28px] py-[24px] right-0 rounded-[16px] top-[153.5px]" data-name="Point 4">
      <div aria-hidden="true" className="absolute border-[#22c55e] border-r-4 border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0_0.88px_0] rounded-[16px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Point 4:shadow" />
      <Heading22 />
      <Container52 />
    </div>
  );
}

function Heading23() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1e293b] text-[18px] text-right w-[95.78px]">
          <p className="leading-[28px] whitespace-pre-wrap">תמיכה ב-RTL</p>
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[46px] justify-center leading-[22.75px] relative shrink-0 text-[#475569] text-[14px] text-right w-[333.25px] whitespace-pre-wrap">
          <p className="mb-0">תמיכה מלאה ביישור לימין גם במעברים, גלילות אופקיות ואנימציות</p>
          <p>ממשק.</p>
        </div>
      </div>
    </div>
  );
}

function Point4() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[7.375px] items-start left-[434.67px] pl-[24px] pr-[28px] py-[24px] right-[434.66px] rounded-[16px] top-[153.5px]" data-name="Point 5">
      <div aria-hidden="true" className="absolute border-[#22c55e] border-r-4 border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0_0.88px_0] rounded-[16px] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]" data-name="Point 5:shadow" />
      <Heading23 />
      <Container53 />
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[283px] relative shrink-0 w-full" data-name="Container">
      <Point />
      <Point1 />
      <Point2 />
      <Point3 />
      <Point4 />
    </div>
  );
}

function SectionMobileDesignGuidelines() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Section - MobileDesignGuidelines">
      <Container47 />
      <Container48 />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[14px] text-right w-[34.33px]">
        <p className="leading-[20px] whitespace-pre-wrap">תמיכה</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[14px] text-right w-[85.27px]">
        <p className="leading-[20px] whitespace-pre-wrap">מדריך למשתמש</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[14px] text-right w-[50.25px]">
        <p className="leading-[20px] whitespace-pre-wrap">אפיון טכני</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0" data-name="Container">
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[14px] text-right w-[380.34px]">
        <p className="leading-[20px] whitespace-pre-wrap">© 2024 TravelPro Production. כל הזכויות שמורות למחלקת פיתוח מוצר.</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[20px] text-right text-white tracking-[-0.5px] w-[79.98px]">
        <p className="leading-[28px] whitespace-pre-wrap">TravelPro</p>
      </div>
    </div>
  );
}

function Svg7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p17ed8880} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#f97316] content-stretch flex flex-col items-start p-[6px] relative rounded-[8px] shrink-0" data-name="Background">
      <Svg7 />
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Container58 />
      <Background5 />
    </div>
  );
}

function Container54() {
  return (
    <div className="max-w-[1152px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center max-w-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between max-w-[inherit] pl-[24.02px] pr-[24px] relative w-full">
          <Container55 />
          <Container56 />
          <Container57 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[#0f172a] relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[#1e293b] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[40px] pt-[49px] px-[64px] relative w-full">
        <Container54 />
      </div>
    </div>
  );
}

export default function Mvp() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col gap-[40px] items-center relative size-full" data-name="מפרט MVP מעודכן עם מובייל">
      <MainHeader />
      <Main />
      <SectionMobileDesignGuidelines />
      <Footer />
    </div>
  );
}