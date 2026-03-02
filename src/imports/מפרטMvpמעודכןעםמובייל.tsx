import svgPaths from "./svg-1n36bxrhr2";

function Container3() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[59.27px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">סטטוס מסמך</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[111.7px] shrink-0 flex-col justify-center text-right font-['Assistant:Semi_Bold',sans-serif] text-[16px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">מאושר לאפיון טכני</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <Container3 />
      <Container4 />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative size-[24px] shrink-0" data-name="SVG">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <title>Interface icon</title>
        <g id="SVG">
          <path
            d={svgPaths.p24991e60}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start rounded-[8px] bg-[#f97316] p-[8px]"
      data-name="Background"
    >
      <Svg />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[11.99px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container2 />
        <Background />
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start rounded-[12px] bg-[rgba(255,255,255,0.1)] p-[17px] backdrop-blur-[6px]"
      data-name="Overlay+Border+OverlayBlur"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,255,255,0.2)] border-solid"
      />
      <Container1 />
    </div>
  );
}

function Heading() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 1"
    >
      <div className="relative flex h-[40px] w-[543.2px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[36px] text-white leading-[0]">
        <p className="whitespace-pre-wrap leading-[40px]">
          מפרט MVP - מערכת ניהול הצעות מחיר
        </p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[28px] w-[367.53px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#cbd5e1] text-[18px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">
          TravelPro SaaS - פלטפורמה למפיקי טיולים ונופש עסקי
        </p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[8px]"
      data-name="Container"
    >
      <Heading />
      <Container6 />
    </div>
  );
}

function Container() {
  return (
    <div
      className="relative flex w-full max-w-[1152px] shrink-0 content-stretch items-center justify-between"
      data-name="Container"
    >
      <OverlayBorderOverlayBlur />
      <Container5 />
    </div>
  );
}

function MainHeader() {
  return (
    <div
      className="relative w-full shrink-0"
      data-name="MainHeader"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(15, 23, 42) 100%)",
      }}
    >
      <div className="relative flex w-full flex-col content-stretch items-start px-[64px] py-[48px]">
        <div
          className="absolute inset-0 bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
          data-name="MainHeader:shadow"
        />
        <Container />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 2"
    >
      <div className="relative flex h-[32px] w-[271.11px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[24px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">
          מטרות על (Strategic Goals)
        </p>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative size-[24px] shrink-0" data-name="SVG">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <title>Interface icon</title>
        <g id="SVG">
          <path
            d={svgPaths.p48d5200}
            id="Vector"
            stroke="var(--stroke-0, #EA580C)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start rounded-[9999px] bg-[#ffedd5] p-[8px]"
      data-name="Background"
    >
      <Svg1 />
    </div>
  );
}

function Container7() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] pl-[780.89px]">
          <Heading1 />
          <Background1 />
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[138.67px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[18px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">
            תמחור חכם ורווחיות
          </p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[52px] w-[285.28px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[16px] leading-[26px]">
          <p className="mb-0">שקיפות מלאה על שולי הרווח בכל רכיב, עם מנגנון</p>
          <p>משקולות (1-5) לניהול סיכונים ורווח.</p>
        </div>
      </div>
    </div>
  );
}

function Goal2() {
  return (
    <div
      className="relative min-h-px min-w-px flex-[1_0_0] self-stretch rounded-[16px] bg-white"
      data-name="Goal 3"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border-[#f97316] border-t-4 border-solid"
      />
      <div className="relative flex size-full flex-col content-stretch items-start gap-[12px] px-[24px] pt-[28px] pb-[24px]">
        <div
          className="absolute inset-0 rounded-[16px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
          data-name="Goal 3:shadow"
        />
        <Heading2 />
        <Container9 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[146.25px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[18px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">{`ניהול בנק ספקים 'חי'`}</p>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[52px] w-[278.81px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[16px] leading-[26px]">
          <p className="mb-0">עדכון מוצרים וספקים תוך כדי עבודה על פרויקט,</p>
          <p>שמירה על מאגר עדכני ונגיש לכל הצוות.</p>
        </div>
      </div>
    </div>
  );
}

function Goal1() {
  return (
    <div
      className="relative min-h-px min-w-px flex-[1_0_0] self-stretch rounded-[16px] bg-white"
      data-name="Goal 2"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border-[#f97316] border-t-4 border-solid"
      />
      <div className="relative flex size-full flex-col content-stretch items-start gap-[12px] px-[24px] pt-[28px] pb-[24px]">
        <div
          className="absolute inset-0 rounded-[16px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
          data-name="Goal 2:shadow"
        />
        <Heading3 />
        <Container10 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[137.06px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[18px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">
            בניית הצעות מהירה
          </p>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[78px] w-[277.91px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[16px] leading-[26px]">
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
    <div
      className="relative min-h-px min-w-px flex-[1_0_0] self-stretch rounded-[16px] bg-white"
      data-name="Goal 1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border-[#f97316] border-t-4 border-solid"
      />
      <div className="relative flex size-full flex-col content-stretch items-start gap-[12px] px-[24px] pt-[28px] pb-[24px]">
        <div
          className="absolute inset-0 rounded-[16px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
          data-name="Goal 1:shadow"
        />
        <Heading4 />
        <Container11 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-center gap-[24px]"
      data-name="Container"
    >
      <Goal2 />
      <Goal1 />
      <Goal />
    </div>
  );
}

function SectionStrategicGoals() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[24px]"
      data-name="Section - StrategicGoals"
    >
      <Container7 />
      <Container8 />
    </div>
  );
}

function Heading5() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 2"
    >
      <div className="relative flex h-[32px] w-[276.69px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[24px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">
          מסכי ה-MVP (Core Screens)
        </p>
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative size-[24px] shrink-0" data-name="SVG">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <title>Interface icon</title>
        <g id="SVG">
          <path
            d={svgPaths.p2787e620}
            id="Vector"
            stroke="var(--stroke-0, #2563EB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start rounded-[9999px] bg-[#dbeafe] p-[8px]"
      data-name="Background"
    >
      <Svg2 />
    </div>
  );
}

function Container12() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] pl-[711.31px]">
          <Heading5 />
          <Background2 />
        </div>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[24px] w-[149.94px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          לוח בקרה (Dashboard)
        </p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[40px] w-[254.34px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
        <p className="mb-0">סקירת פרויקטים פתוחים, התראות על מסמכים פגי</p>
        <p>תוקף וסטטיסטיקות עבודה.</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px] self-stretch"
      data-name="Container"
    >
      <Heading6 />
      <Container15 />
    </div>
  );
}

function Container16() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch"
      data-name="Container"
    >
      <div
        className="relative h-[13.19px] w-[18.45px] shrink-0"
        data-name="Icon"
      >
        <svg
          className="absolute inset-0 block"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 18.4501 13.19"
        >
          <title>Interface icon</title>
          <path
            d={svgPaths.p2fd2de00}
            fill="var(--fill-0, #F97316)"
            id="Icon"
          />
        </svg>
      </div>
    </div>
  );
}

function ScreenItem() {
  return (
    <div
      className="absolute top-0 right-0 left-[714.67px] flex content-stretch items-start gap-[16px] rounded-[12px] p-[16px]"
      data-name="Screen Item"
    >
      <Container14 />
      <Container16 />
    </div>
  );
}

function Heading7() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[24px] w-[195.59px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          פרויקט ותמחור (Quote Editor)
        </p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[40px] w-[210.11px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
        <p className="mb-0">ניהול רכיבי הטיול (תחבורה, לינה, פעילות)</p>
        <p>וטבלאות רווחיות דינמיות.</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px] self-stretch"
      data-name="Container"
    >
      <Heading7 />
      <Container18 />
    </div>
  );
}

function Container19() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch"
      data-name="Container"
    >
      <div className="relative flex h-[28px] w-[20.92px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#f97316] text-[20px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">02</p>
      </div>
    </div>
  );
}

function ScreenItem1() {
  return (
    <div
      className="absolute top-0 right-[357.33px] left-[357.34px] flex content-stretch items-start gap-[16px] rounded-[12px] p-[16px]"
      data-name="Screen Item"
    >
      <Container17 />
      <Container19 />
    </div>
  );
}

function Heading8() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[24px] w-[181.48px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          בנק ספקים (Supplier Bank)
        </p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[40px] w-[255.42px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
        <p className="mb-0">ניהול מרכזי של כלל הספקים עם סינון לפי קטגוריה,</p>
        <p>אזור ודירוג.</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px] self-stretch"
      data-name="Container"
    >
      <Heading8 />
      <Container21 />
    </div>
  );
}

function Container22() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch"
      data-name="Container"
    >
      <div className="relative flex h-[28px] w-[20.92px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#f97316] text-[20px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">03</p>
      </div>
    </div>
  );
}

function ScreenItem2() {
  return (
    <div
      className="absolute top-0 right-[714.66px] left-0 flex content-stretch items-start gap-[16px] rounded-[12px] p-[16px]"
      data-name="Screen Item"
    >
      <Container20 />
      <Container22 />
    </div>
  );
}

function Heading9() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[24px] w-[187.86px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          כרטיס ספק (Supplier Detail)
        </p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[40px] w-[239.88px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
        <p className="mb-0">פרטי קשר, אנשי קשר, מוצרים מוצעים ומסמכים</p>
        <p>רגולטוריים (ביטוח/רישיון).</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px] self-stretch"
      data-name="Container"
    >
      <Heading9 />
      <Container24 />
    </div>
  );
}

function Container25() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch"
      data-name="Container"
    >
      <div className="relative flex h-[28px] w-[20.92px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#f97316] text-[20px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">04</p>
      </div>
    </div>
  );
}

function ScreenItem3() {
  return (
    <div
      className="absolute top-[132px] right-0 left-[714.67px] flex content-stretch items-start gap-[16px] rounded-[12px] p-[16px]"
      data-name="Screen Item"
    >
      <Container23 />
      <Container25 />
    </div>
  );
}

function Heading10() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[24px] w-[175.52px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          תצוגת לקוח (Client Quote)
        </p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[40px] w-[219.47px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
        <p className="mb-0">עמוד נחיתה מעוצב ללקוח הקצה המציג את</p>
        <p>תוכנית הטיול והמחיר הסופי.</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px] self-stretch"
      data-name="Container"
    >
      <Heading10 />
      <Container27 />
    </div>
  );
}

function Container28() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch"
      data-name="Container"
    >
      <div className="relative flex h-[28px] w-[20.92px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#f97316] text-[20px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">05</p>
      </div>
    </div>
  );
}

function ScreenItem4() {
  return (
    <div
      className="absolute top-[132px] right-[357.33px] left-[357.34px] flex content-stretch items-start gap-[16px] rounded-[12px] p-[16px]"
      data-name="Screen Item"
    >
      <Container26 />
      <Container28 />
    </div>
  );
}

function Heading11() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[24px] w-[220.47px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          אשף סיווג (Classification Wizard)
        </p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[40px] w-[243.81px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
        <p className="mb-0">מנגנון מהיר להוספה וסיווג ספקים חדשים למאגר</p>
        <p>המערכת.</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px] self-stretch"
      data-name="Container"
    >
      <Heading11 />
      <Container30 />
    </div>
  );
}

function Container31() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch"
      data-name="Container"
    >
      <div className="relative flex h-[28px] w-[20.92px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#f97316] text-[20px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">06</p>
      </div>
    </div>
  );
}

function ScreenItem5() {
  return (
    <div
      className="absolute top-[132px] right-[714.66px] left-0 flex content-stretch items-start gap-[16px] rounded-[12px] p-[16px]"
      data-name="Screen Item"
    >
      <Container29 />
      <Container31 />
    </div>
  );
}

function Container13() {
  return (
    <div className="relative h-[232px] w-full shrink-0" data-name="Container">
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
    <div
      className="relative w-full shrink-0 rounded-[24px] bg-white"
      data-name="Section - MVPScreens"
    >
      <div className="relative flex w-full flex-col content-stretch items-start gap-[32px] p-[32px]">
        <div
          className="absolute inset-0 rounded-[24px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
          data-name="Section - MVPScreens:shadow"
        />
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative size-[24px] shrink-0" data-name="SVG">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <title>Interface icon</title>
        <g id="SVG">
          <path
            d={svgPaths.p147020c0}
            id="Vector"
            stroke="var(--stroke-0, #FB923C)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Heading12() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 2">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] pl-[197.64px]">
          <div className="relative flex h-[32px] w-[238.36px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[24px] text-white leading-[0]">
            <p className="whitespace-pre-wrap leading-[32px]">
              ישויות מרכזיות (Entities)
            </p>
          </div>
          <Svg3 />
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[24px] w-[50.31px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#fb923c] text-[16px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[24px]">Project</p>
        </div>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[40px] w-[151.59px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#cbd5e1] text-[14px] leading-[20px]">
          <p className="mb-0">פרויקט/טיול הכולל לוח זמנים,</p>
          <p>משתתפים ותקציב.</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div
      className="absolute top-0 right-0 left-[244px] flex flex-col content-stretch items-start gap-[4px] rounded-[12px] bg-[rgba(255,255,255,0.1)] p-[17px]"
      data-name="Overlay+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,255,255,0.1)] border-solid"
      />
      <Container34 />
      <Container35 />
    </div>
  );
}

function Container36() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[24px] w-[59.44px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#fb923c] text-[16px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[24px]">Supplier</p>
        </div>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[40px] w-[165.17px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#cbd5e1] text-[14px] leading-[20px]">
          <p className="mb-0">ישות משפטית המספקת שירותים</p>
          <p>(חברה/עוסק).</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder1() {
  return (
    <div
      className="absolute top-0 right-[244px] left-0 flex flex-col content-stretch items-start gap-[4px] rounded-[12px] bg-[rgba(255,255,255,0.1)] p-[17px]"
      data-name="Overlay+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,255,255,0.1)] border-solid"
      />
      <Container36 />
      <Container37 />
    </div>
  );
}

function Container38() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[24px] w-[55.88px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#fb923c] text-[16px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[24px]">Product</p>
        </div>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[40px] w-[175.86px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#cbd5e1] text-[14px] leading-[20px]">
          <p className="mb-0">{`שירות ספציפי (למשל: "אוטובוס 50`}</p>
          <p>{`מקומות").`}</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder2() {
  return (
    <div
      className="absolute top-[118px] right-0 left-[244px] flex flex-col content-stretch items-start gap-[4px] rounded-[12px] bg-[rgba(255,255,255,0.1)] p-[17px]"
      data-name="Overlay+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,255,255,0.1)] border-solid"
      />
      <Container38 />
      <Container39 />
    </div>
  );
}

function Container40() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[24px] w-[42.36px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#fb923c] text-[16px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[24px]">Quote</p>
        </div>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[40px] w-[176.77px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#cbd5e1] text-[14px] leading-[20px]">
          <p className="mb-0">הצעת מחיר הכוללת תמחור רכיבים</p>
          <p>וסיכומי רווח.</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder3() {
  return (
    <div
      className="absolute top-[118px] right-[244px] left-0 flex flex-col content-stretch items-start gap-[4px] rounded-[12px] bg-[rgba(255,255,255,0.1)] p-[17px]"
      data-name="Overlay+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,255,255,0.1)] border-solid"
      />
      <Container40 />
      <Container41 />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative h-[220px] w-full shrink-0" data-name="Container">
      <OverlayBorder />
      <OverlayBorder1 />
      <OverlayBorder2 />
      <OverlayBorder3 />
    </div>
  );
}

function SectionEntities() {
  return (
    <div
      className="relative min-h-px min-w-px flex-[1_0_0] self-stretch rounded-[24px] bg-[#0f172a]"
      data-name="Section - Entities"
    >
      <div className="relative flex size-full flex-col content-stretch items-start gap-[24px] p-[32px]">
        <div
          className="absolute inset-0 rounded-[24px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
          data-name="Section - Entities:shadow"
        />
        <Heading12 />
        <Container33 />
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative size-[24px] shrink-0" data-name="SVG">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <title>Interface icon</title>
        <g id="SVG">
          <path
            d={svgPaths.p156ae100}
            id="Vector"
            stroke="var(--stroke-0, #F97316)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Heading13() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 2">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding pl-[127.09px]">
          <div className="relative flex h-[32px] w-[304.91px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[24px] leading-[0]">
            <p className="whitespace-pre-wrap leading-[32px]">
              לוגיקה עסקית (Business Logic)
            </p>
          </div>
          <Svg4 />
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div
      className="relative h-[48px] w-[448px] shrink-0 text-right text-[#334155] text-[16px] leading-[0]"
      data-name="Paragraph"
    >
      <div className="absolute top-[11.5px] right-0 flex h-[24px] w-[90.47px] -translate-y-1/2 flex-col justify-center font-['Assistant:Bold',sans-serif] font-bold">
        <p className="whitespace-pre-wrap leading-[24px]">משקולות רווח:</p>
      </div>
      <div className="absolute top-[11.5px] right-[90.47px] flex h-[24px] w-[342.55px] -translate-y-1/2 flex-col justify-center font-['Assistant:Regular',sans-serif] font-normal">
        <p className="whitespace-pre-wrap leading-[24px]">
          {" לכל ספק/מוצר מוצמד דירוג 1-5 הקובע אוטומטית את אחוז"}
        </p>
      </div>
      <div className="absolute top-[35.5px] right-[-0.01px] flex h-[24px] w-[262.13px] -translate-y-1/2 flex-col justify-center font-['Assistant:Regular',sans-serif] font-normal">
        <p className="whitespace-pre-wrap leading-[24px]">
          הרווח המומלץ (למשל: 5 כוכבים = 25% רווח).
        </p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div
      className="relative flex h-[14px] w-[8px] shrink-0 flex-col content-stretch items-start pt-[6px]"
      data-name="Margin"
    >
      <div
        className="size-[8px] shrink-0 rounded-[9999px] bg-[#f97316]"
        data-name="Background"
      />
    </div>
  );
}

function Item() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start gap-[12px]"
      data-name="Item"
    >
      <Paragraph />
      <Margin />
    </div>
  );
}

function Paragraph1() {
  return (
    <div
      className="relative h-[48px] w-[448px] shrink-0 text-right text-[#334155] text-[16px] leading-[0]"
      data-name="Paragraph"
    >
      <div className="absolute top-[11.5px] right-0 flex h-[24px] w-[88.27px] -translate-y-1/2 flex-col justify-center font-['Assistant:Bold',sans-serif] font-bold">
        <p className="whitespace-pre-wrap leading-[24px]">סיווג אוטומטי:</p>
      </div>
      <div className="absolute top-[11.5px] right-[88.26px] flex h-[24px] w-[356.91px] -translate-y-1/2 flex-col justify-center font-['Assistant:Regular',sans-serif] font-normal">
        <p className="whitespace-pre-wrap leading-[24px]">
          {" זיהוי אוטומטי של סוג השירות (הסעות/קייטרינג/אטרקציה) לפי"}
        </p>
      </div>
      <div className="absolute top-[35.5px] right-0 flex h-[24px] w-[161.44px] -translate-y-1/2 flex-col justify-center font-['Assistant:Regular',sans-serif] font-normal">
        <p className="whitespace-pre-wrap leading-[24px]">
          מילות מפתח בתיאור הספק.
        </p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div
      className="relative flex h-[14px] w-[8px] shrink-0 flex-col content-stretch items-start pt-[6px]"
      data-name="Margin"
    >
      <div
        className="size-[8px] shrink-0 rounded-[9999px] bg-[#f97316]"
        data-name="Background"
      />
    </div>
  );
}

function Item1() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start gap-[12px]"
      data-name="Item"
    >
      <Paragraph1 />
      <Margin1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div
      className="relative h-[48px] w-[448px] shrink-0 text-right text-[#334155] text-[16px] leading-[0]"
      data-name="Paragraph"
    >
      <div className="absolute top-[11.5px] right-0 flex h-[24px] w-[200.22px] -translate-y-1/2 flex-col justify-center font-['Assistant:Bold',sans-serif] font-bold">
        <p className="whitespace-pre-wrap leading-[24px]">
          משיכת נתונים (Web Scraping):
        </p>
      </div>
      <div className="absolute top-[11.5px] right-[200.22px] flex h-[24px] w-[221.7px] -translate-y-1/2 flex-col justify-center font-['Assistant:Regular',sans-serif] font-normal">
        <p className="whitespace-pre-wrap leading-[24px]">
          {" יכולת בסיסית לשאוב תמונות ותיאורים"}
        </p>
      </div>
      <div className="absolute top-[35.5px] right-0 flex h-[24px] w-[248.75px] -translate-y-1/2 flex-col justify-center font-['Assistant:Regular',sans-serif] font-normal">
        <p className="whitespace-pre-wrap leading-[24px]">
          מאתרי ספקים חיצוניים לתוך כרטיס המוצר.
        </p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div
      className="relative flex h-[14px] w-[8px] shrink-0 flex-col content-stretch items-start pt-[6px]"
      data-name="Margin"
    >
      <div
        className="size-[8px] shrink-0 rounded-[9999px] bg-[#f97316]"
        data-name="Background"
      />
    </div>
  );
}

function Item2() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start gap-[12px]"
      data-name="Item"
    >
      <Paragraph2 />
      <Margin2 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div
      className="relative h-[48px] w-[448px] shrink-0 text-right text-[#334155] text-[16px] leading-[0]"
      data-name="Paragraph"
    >
      <div className="absolute top-[11.5px] right-0 flex h-[24px] w-[87.84px] -translate-y-1/2 flex-col justify-center font-['Assistant:Bold',sans-serif] font-bold">
        <p className="whitespace-pre-wrap leading-[24px]">ניהול גרסאות:</p>
      </div>
      <div className="absolute top-[11.5px] right-[87.84px] flex h-[24px] w-[356.5px] -translate-y-1/2 flex-col justify-center font-['Assistant:Regular',sans-serif] font-normal">
        <p className="whitespace-pre-wrap leading-[24px]">{` שמירת היסטוריית שינויים לכל הצעת מחיר למעקב אחרי מו"מ`}</p>
      </div>
      <div className="absolute top-[35.5px] right-0 flex h-[24px] w-[70.22px] -translate-y-1/2 flex-col justify-center font-['Assistant:Regular',sans-serif] font-normal">
        <p className="whitespace-pre-wrap leading-[24px]">מול לקוחות.</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div
      className="relative flex h-[14px] w-[8px] shrink-0 flex-col content-stretch items-start pt-[6px]"
      data-name="Margin"
    >
      <div
        className="size-[8px] shrink-0 rounded-[9999px] bg-[#f97316]"
        data-name="Background"
      />
    </div>
  );
}

function Item3() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start gap-[12px]"
      data-name="Item"
    >
      <Paragraph3 />
      <Margin3 />
    </div>
  );
}

function List() {
  return (
    <div className="relative w-full shrink-0" data-name="List">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding">
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
    <div
      className="relative min-h-px min-w-px flex-[1_0_0] self-stretch rounded-[24px] bg-white"
      data-name="Section - BusinessLogic"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[24px] border-[#f97316] border-r-4 border-solid"
      />
      <div className="relative flex size-full flex-col content-stretch items-start gap-[24px] py-[32px] pr-[36px] pl-[32px]">
        <div
          className="absolute inset-0 rounded-[24px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
          data-name="Section - BusinessLogic:shadow"
        />
        <Heading13 />
        <List />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-center gap-[32px]"
      data-name="Container"
    >
      <SectionEntities />
      <SectionBusinessLogic />
    </div>
  );
}

function Heading14() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 2"
    >
      <div className="relative flex h-[32px] w-[313.16px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[24px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">
          הנחיות עיצוב (UI/UX Principles)
        </p>
      </div>
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative size-[24px] shrink-0" data-name="SVG">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <title>Interface icon</title>
        <g id="SVG">
          <path
            d={svgPaths.p22cfe480}
            id="Vector"
            stroke="var(--stroke-0, #9333EA)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start rounded-[9999px] bg-[#f3e8ff] p-[8px]"
      data-name="Background"
    >
      <Svg5 />
    </div>
  );
}

function Container42() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding pl-[674.84px]">
          <Heading14 />
          <Background3 />
        </div>
      </div>
    </div>
  );
}

function Heading15() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 4">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[24px] w-[141.39px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[24px]">
            נגישות וחוויית משתמש
          </p>
        </div>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[60px] w-[267.41px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[20px]">
          <p className="mb-0">
            ניגודיות גבוהה בטבלאות נתונים, מצבי סטטוס ברורים
          </p>
          <p className="mb-0">
            (פעיל/ממתין/פג תוקף) וניווט צידי (Sidebar) קבוע
          </p>
          <p>להתמצאות קלה.</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div
      className="relative min-h-px min-w-[250px] flex-[1_0_0] self-stretch rounded-[16px] bg-[#f8fafc]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#e2e8f0] border-solid"
      />
      <div className="relative flex size-full min-w-[inherit] flex-col content-stretch items-start gap-[8px] p-[21px]">
        <Heading15 />
        <Container44 />
      </div>
    </div>
  );
}

function Heading16() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 4">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[24px] w-[125.63px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[24px]">תמיכה מלאה ב-RTL</p>
        </div>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[60px] w-[293.97px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[20px]">
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
    <div
      className="relative min-h-px min-w-[250px] flex-[1_0_0] self-stretch rounded-[16px] bg-[#f8fafc]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#e2e8f0] border-solid"
      />
      <div className="relative flex size-full min-w-[inherit] flex-col content-stretch items-start gap-[8px] p-[21px]">
        <Heading16 />
        <Container45 />
      </div>
    </div>
  );
}

function Heading17() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 4">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[24px] w-[158.84px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[24px]">
            אסתטיקה מעולם התיירות
          </p>
        </div>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[60px] w-[273.94px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[20px]">
          <p className="mb-0">
            שימוש בצבעי כתום (אנרגיה), כחול עמוק (אמינות) ולבן
          </p>
          <p className="mb-0">
            נקי. תמונות רקע של נופים ואייקונים מעולם התחבורה
          </p>
          <p>והפנאי.</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div
      className="relative min-h-px min-w-[250px] flex-[1_0_0] self-stretch rounded-[16px] bg-[#f8fafc]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#e2e8f0] border-solid"
      />
      <div className="relative flex size-full min-w-[inherit] flex-col content-stretch items-start gap-[8px] p-[21px]">
        <Heading17 />
        <Container46 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start justify-center gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding">
        <BackgroundBorder />
        <BackgroundBorder1 />
        <BackgroundBorder2 />
      </div>
    </div>
  );
}

function SectionDesignGuidelines() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[24px] bg-white"
      data-name="Section - DesignGuidelines"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[24px] border-[#f97316] border-b-8 border-solid"
      />
      <div className="relative flex w-full flex-col content-stretch items-start gap-[24px] px-[32px] pt-[32px] pb-[40px]">
        <div
          className="absolute inset-0 rounded-[24px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
          data-name="Section - DesignGuidelines:shadow"
        />
        <Container42 />
        <Container43 />
      </div>
    </div>
  );
}

function Main() {
  return (
    <div
      className="relative flex w-[1152px] max-w-[1152px] shrink-0 flex-col content-stretch items-start gap-[48px] px-[24px] pb-[40px]"
      data-name="Main"
    >
      <SectionStrategicGoals />
      <SectionMvpScreens />
      <Container32 />
      <SectionDesignGuidelines />
    </div>
  );
}

function Heading18() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 2"
    >
      <div className="relative flex h-[32px] w-[300.3px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[24px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">
          דגשים לעיצוב מובייל (דף הצעה)
        </p>
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative size-[24px] shrink-0" data-name="SVG">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <title>Interface icon</title>
        <g id="SVG">
          <path
            d={svgPaths.p2bc7c260}
            id="Vector"
            stroke="var(--stroke-0, #16A34A)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start rounded-[9999px] bg-[#dcfce7] p-[8px]"
      data-name="Background"
    >
      <Svg6 />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] pl-[927.7px]">
          <Heading18 />
          <Background4 />
        </div>
      </div>
    </div>
  );
}

function Heading19() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[103.27px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[18px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">Sticky Footer</p>
        </div>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[46px] w-[330.47px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[22.75px]">
          <p className="mb-0">
            כפתור אישור הצעה ומחיר סופי חייבים להיות תמיד גלויים בתחתית
          </p>
          <p>המסך לגישה מהירה.</p>
        </div>
      </div>
    </div>
  );
}

function Point() {
  return (
    <div
      className="absolute top-0 right-0 left-[869.34px] flex flex-col content-stretch items-start gap-[7.375px] rounded-[16px] bg-white py-[24px] pr-[28px] pl-[24px]"
      data-name="Point 1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border-[#22c55e] border-r-4 border-solid"
      />
      <div
        className="absolute inset-[0_0_0.88px_0] rounded-[16px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
        data-name="Point 1:shadow"
      />
      <Heading19 />
      <Container49 />
    </div>
  );
}

function Heading20() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[64.69px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[18px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">{`לו"ז אנכי`}</p>
        </div>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[46px] w-[329.37px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[22.75px]">
          <p className="mb-0">{`הצגת הלו"ז כציר זמן ברור (Timeline) עם אייקונים מתאימים לכל`}</p>
          <p>פעילות להתאמה למסכים צרים.</p>
        </div>
      </div>
    </div>
  );
}

function Point1() {
  return (
    <div
      className="absolute top-0 right-[434.66px] left-[434.67px] flex flex-col content-stretch items-start gap-[7.375px] rounded-[16px] bg-white py-[24px] pr-[28px] pl-[24px]"
      data-name="Point 2"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border-[#22c55e] border-r-4 border-solid"
      />
      <div
        className="absolute inset-[0_0_0.88px_0] rounded-[16px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
        data-name="Point 2:shadow"
      />
      <Heading20 />
      <Container50 />
    </div>
  );
}

function Heading21() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[103.55px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[18px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">תמונות ופריסה</p>
        </div>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[46px] w-[355.36px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[22.75px]">
          <p className="mb-0">
            פריסה של תמונה ברוחב מלא מעל הטקסט השיווקי (במקום 75/25) כדי
          </p>
          <p>למקסם קריאות וחוויה ויזואלית.</p>
        </div>
      </div>
    </div>
  );
}

function Point2() {
  return (
    <div
      className="absolute top-0 right-[869.32px] left-[0.02px] flex flex-col content-stretch items-start gap-[7.375px] rounded-[16px] bg-white py-[24px] pr-[28px] pl-[24px]"
      data-name="Point 3"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border-[#22c55e] border-r-4 border-solid"
      />
      <div
        className="absolute inset-[0_0_0.88px_0] rounded-[16px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
        data-name="Point 3:shadow"
      />
      <Heading21 />
      <Container51 />
    </div>
  );
}

function Heading22() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[47.45px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[18px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">נגישות</p>
        </div>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[46px] w-[357.42px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[22.75px]">
          <p className="mb-0">
            כפתורים גדולים (מינימום 44px גובה) ללחיצה קלה ומדויקת עם האגודל
          </p>
          <p>במכשירים ניידים.</p>
        </div>
      </div>
    </div>
  );
}

function Point3() {
  return (
    <div
      className="absolute top-[153.5px] right-0 left-[869.34px] flex flex-col content-stretch items-start gap-[7.375px] rounded-[16px] bg-white py-[24px] pr-[28px] pl-[24px]"
      data-name="Point 4"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border-[#22c55e] border-r-4 border-solid"
      />
      <div
        className="absolute inset-[0_0_0.88px_0] rounded-[16px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
        data-name="Point 4:shadow"
      />
      <Heading22 />
      <Container52 />
    </div>
  );
}

function Heading23() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[95.78px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[18px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">תמיכה ב-RTL</p>
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[46px] w-[333.25px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[22.75px]">
          <p className="mb-0">
            תמיכה מלאה ביישור לימין גם במעברים, גלילות אופקיות ואנימציות
          </p>
          <p>ממשק.</p>
        </div>
      </div>
    </div>
  );
}

function Point4() {
  return (
    <div
      className="absolute top-[153.5px] right-[434.66px] left-[434.67px] flex flex-col content-stretch items-start gap-[7.375px] rounded-[16px] bg-white py-[24px] pr-[28px] pl-[24px]"
      data-name="Point 5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border-[#22c55e] border-r-4 border-solid"
      />
      <div
        className="absolute inset-[0_0_0.88px_0] rounded-[16px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.1)]"
        data-name="Point 5:shadow"
      />
      <Heading23 />
      <Container53 />
    </div>
  );
}

function Container48() {
  return (
    <div className="relative h-[283px] w-full shrink-0" data-name="Container">
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
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[24px]"
      data-name="Section - MobileDesignGuidelines"
    >
      <Container47 />
      <Container48 />
    </div>
  );
}

function Link() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch"
      data-name="Link"
    >
      <div className="relative flex h-[20px] w-[34.33px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">תמיכה</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch"
      data-name="Link"
    >
      <div className="relative flex h-[20px] w-[85.27px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">מדריך למשתמש</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch"
      data-name="Link"
    >
      <div className="relative flex h-[20px] w-[50.25px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">אפיון טכני</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-start gap-[24px]"
      data-name="Container"
    >
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

function Container56() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[380.34px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          © 2024 TravelPro Production. כל הזכויות שמורות למחלקת פיתוח מוצר.
        </p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[28px] w-[79.98px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[20px] text-white leading-[0] tracking-[-0.5px]">
        <p className="whitespace-pre-wrap leading-[28px]">TravelPro</p>
      </div>
    </div>
  );
}

function Svg7() {
  return (
    <div className="relative size-[20px] shrink-0" data-name="SVG">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <title>Interface icon</title>
        <g id="SVG">
          <path
            d={svgPaths.p17ed8880}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Background5() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start rounded-[8px] bg-[#f97316] p-[6px]"
      data-name="Background"
    >
      <Svg7 />
    </div>
  );
}

function Container57() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px]"
      data-name="Container"
    >
      <Container58 />
      <Background5 />
    </div>
  );
}

function Container54() {
  return (
    <div
      className="relative w-full max-w-[1152px] shrink-0"
      data-name="Container"
    >
      <div className="flex size-full max-w-[inherit] flex-row items-center">
        <div className="relative flex w-full max-w-[inherit] content-stretch items-center justify-between border-0 border-[transparent] border-solid bg-clip-padding pr-[24px] pl-[24.02px]">
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
    <div className="relative w-full shrink-0 bg-[#0f172a]" data-name="Footer">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#1e293b] border-t border-solid"
      />
      <div className="relative flex w-full flex-col content-stretch items-start px-[64px] pt-[49px] pb-[40px]">
        <Container54 />
      </div>
    </div>
  );
}

export default function Mvp() {
  return (
    <div
      className="relative flex size-full flex-col content-stretch items-center gap-[40px] bg-[#f9fafb]"
      data-name="מפרט MVP מעודכן עם מובייל"
    >
      <MainHeader />
      <Main />
      <SectionMobileDesignGuidelines />
      <Footer />
    </div>
  );
}
