import svgPaths from "./svg-ftq7cqozpq";
import imgBackground from "figma:asset/3156a5334ba2e85a36b93a08a140bd88a4dacc80.png";
import imgImage from "figma:asset/243298721546b5ed3cd8adf6bcb99ca1943ff53b.png";
import imgBackground1 from "figma:asset/3855c5823fa7b1bc9d6be7096f3fb9e2fde8a725.png";
import imgBackground2 from "figma:asset/fb4bcf43b793529e50061aa194eed69e9043a40d.png";

function Background() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex flex-col items-center py-[8px] relative shrink-0 w-full z-[2]" data-name="Background">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-name="Overlay+Shadow" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.35px] w-[250.14px]">
        <p className="leading-[20px] whitespace-pre-wrap">SCREEN LABEL: מוצרים מוצעים מסריקה</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[12px] text-right tracking-[0.6px] uppercase w-[134.75px]">
        <p className="leading-[16px] whitespace-pre-wrap">סריקה אוטומטית הושלמה</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 size-[12.833px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
        <g id="Container">
          <path d={svgPaths.p6da9c80} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[911.23px] relative w-full">
          <Container2 />
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[45px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[36px] text-right tracking-[-1.188px] w-[378.58px]">
        <p className="leading-[45px] whitespace-pre-wrap">מוצרים מוצעים מסריקת אתר</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-end max-w-[672px] relative shrink-0 w-[672px]" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[56px] justify-center leading-[28px] not-italic relative shrink-0 text-[#8d785e] text-[18px] text-right w-[663.48px] whitespace-pre-wrap">
        <p className="mb-0">האלגוריתם שלנו זיהה מוצרים חדשים באתר הספק. באפשרותך לאשר אותם להוספה לקטלוג,</p>
        <p>לערוך את הפרטים או להסיר פריטים שאינם רלוונטיים.</p>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-name="Hero Section">
      <Container1 />
      <Heading />
      <Container4 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,140,0,0.7)] text-right w-[61.92px]">
        <p className="leading-[16px] whitespace-pre-wrap">הערכת מחיר</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Container9 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[24px] w-[103.69px]">
        <p className="leading-[32px] whitespace-pre-wrap">₪849.00</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,140,0,0.7)] text-right w-[75.63px]">
        <p className="leading-[16px] whitespace-pre-wrap">שם מוצר שזוהה</p>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold','Arimo:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#181510] text-[20px] text-right w-[268.19px]">
        <p className="leading-[28px] whitespace-pre-wrap">מקדחה נטענת 18V - Brushless</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Container11 />
      <Heading2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Container10 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,140,0,0.7)] text-right w-[53.66px]">
        <p className="leading-[16px] whitespace-pre-wrap">תיאור מוצע</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[46px] justify-center leading-[22.75px] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-right w-[620.64px] whitespace-pre-wrap">
        <p className="mb-0">מקדחת אימפקט מקצועית מסדרת ה-XR, מנוע ללא פחמים לאורך חיים ממושך, כולל 2 סוללות 5.0Ah ומטען מהיר</p>
        <p>במזוודה קשיחה.</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[7.375px] items-start relative shrink-0 w-full" data-name="Container">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-right w-[95.33px]">
        <p className="leading-[16px] whitespace-pre-wrap">כלי עבודה חשמליים</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[11.083px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.0833 11.6667">
        <g id="Container">
          <path d={svgPaths.pd995200} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-full items-center relative">
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#2563eb] text-[12px] text-right w-[229.73px]">
        <p className="leading-[16px] whitespace-pre-wrap">https://supplier-site.com/tools/drill-v18</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[5.833px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 5.83333">
        <g id="Container">
          <path d={svgPaths.p32d20280} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8.01px] h-full items-center relative">
        <Link />
        <Container19 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[24px] items-start pl-[269.58px] pt-[9px] relative w-full">
        <Container15 />
        <Container18 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container12 />
      <HorizontalBorder />
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p1d9bcc00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex gap-[8px] items-center px-[24px] py-[8px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[63.33px]">
        <p className="leading-[20px] whitespace-pre-wrap">אישור מוצר</p>
      </div>
      <Container21 />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p2cbc1080} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(255,140,0,0.1)] content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-center w-[74.14px]">
        <p className="leading-[20px] whitespace-pre-wrap">עריכת פרטים</p>
      </div>
      <Container22 />
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-center w-[33.58px]">
        <p className="leading-[20px] whitespace-pre-wrap">הסרה</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-end pr-[311.59px] relative w-full">
          <Button />
          <Button1 />
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[32px] relative shrink-0 w-full" data-name="Margin">
      <Container20 />
    </div>
  );
}

function Container5() {
  return (
    <div className="relative self-stretch shrink-0 w-[710.67px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between p-[24px] relative size-full">
        <Container6 />
        <Margin />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#15803d] text-[10px] text-right w-[45.16px]">
        <p className="leading-[15px] whitespace-pre-wrap">ביטחון גבוה</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[12.25px] relative shrink-0 w-[12.833px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.25">
        <g id="Container">
          <path d={svgPaths.p26f9d500} fill="var(--fill-0, #16A34A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayShadowOverlayBlur() {
  return (
    <div className="absolute backdrop-blur-[4px] bg-[rgba(255,255,255,0.9)] content-stretch flex gap-[3.99px] items-center px-[8px] py-[4px] right-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] top-[12px]" data-name="Overlay+Shadow+OverlayBlur">
      <Container23 />
      <Container24 />
    </div>
  );
}

function Background1() {
  return (
    <div className="min-h-[240px] relative self-stretch shrink-0 w-[355.33px]" data-name="Background">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[119.04%] left-0 max-w-none top-[-9.52%] w-full" src={imgBackground} />
      </div>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <OverlayShadowOverlayBlur />
      </div>
    </div>
  );
}

function ProductCard() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Product Card 1">
      <div className="content-stretch flex items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <Container5 />
        <Background1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,140,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,140,0,0.7)] text-right w-[61.92px]">
        <p className="leading-[16px] whitespace-pre-wrap">הערכת מחיר</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Container29 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[24px] w-[124.09px]">
        <p className="leading-[32px] whitespace-pre-wrap">₪1,250.00</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,140,0,0.7)] text-right w-[75.63px]">
        <p className="leading-[16px] whitespace-pre-wrap">שם מוצר שזוהה</p>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[20px] text-right w-[211.59px]">
        <p className="leading-[28px] whitespace-pre-wrap">ארון כלים מודולרי 7 מגירות</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Container31 />
      <Heading3 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container28 />
      <Container30 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,140,0,0.7)] text-right w-[53.66px]">
        <p className="leading-[16px] whitespace-pre-wrap">תיאור מוצע</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[46px] justify-center leading-[22.75px] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-right w-[629.26px] whitespace-pre-wrap">
        <p className="mb-0">מערכת אחסון מקצועית למוסכים וסדנאות. עשוי פלדה עמידה עם ציפוי נגד חלודה, גלגלים מחוזקים עם נעילה ומנגנון</p>
        <p>מניעת פתיחה כפולה.</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col gap-[7.375px] items-start relative shrink-0 w-full" data-name="Container">
      <Container33 />
      <Container34 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-right w-[69.06px]">
        <p className="leading-[16px] whitespace-pre-wrap">פתרונות אחסון</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[11.083px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.0833 11.6667">
        <g id="Container">
          <path d={svgPaths.pd995200} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8.01px] h-full items-center relative">
        <Container36 />
        <Container37 />
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#2563eb] text-[12px] text-right w-[278.63px]">
        <p className="leading-[16px] whitespace-pre-wrap">https://supplier-site.com/storage/cabinet-7drw</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[5.833px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 5.83333">
        <g id="Container">
          <path d={svgPaths.p32d20280} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-full items-center relative">
        <Link1 />
        <Container39 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[24px] items-start pl-[246.95px] pt-[9px] relative w-full">
        <Container35 />
        <Container38 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Container32 />
      <HorizontalBorder1 />
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p1d9bcc00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex gap-[8px] items-center px-[24px] py-[8px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[63.33px]">
        <p className="leading-[20px] whitespace-pre-wrap">אישור מוצר</p>
      </div>
      <Container41 />
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p2cbc1080} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[rgba(255,140,0,0.1)] content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-center w-[74.14px]">
        <p className="leading-[20px] whitespace-pre-wrap">עריכת פרטים</p>
      </div>
      <Container42 />
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-center w-[33.58px]">
        <p className="leading-[20px] whitespace-pre-wrap">הסרה</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-end pr-[311.59px] relative w-full">
          <Button3 />
          <Button4 />
          <Button5 />
        </div>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[32px] relative shrink-0 w-full" data-name="Margin">
      <Container40 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative self-stretch shrink-0 w-[710.67px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between p-[24px] relative size-full">
        <Container26 />
        <Margin1 />
      </div>
    </div>
  );
}

function ProductCard1() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Product Card 2">
      <div className="content-stretch flex items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <Container25 />
        <div className="min-h-[240px] relative self-stretch shrink-0 w-[355.33px]" data-name="Image">
          <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[119.04%] left-0 max-w-none top-[-9.52%] w-full" src={imgImage} />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,140,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,140,0,0.7)] text-right w-[61.92px]">
        <p className="leading-[16px] whitespace-pre-wrap">הערכת מחיר</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-[rgba(255,140,0,0.6)] w-[63.98px]">
        <p className="leading-[32px] whitespace-pre-wrap">₪ ???</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Container49 />
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Container47 />
      <Container48 />
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,140,0,0.7)] text-right w-[75.63px]">
        <p className="leading-[16px] whitespace-pre-wrap">שם מוצר שזוהה</p>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold','Arimo:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#181510] text-[20px] text-right w-[221.63px]">
        <p className="leading-[28px] whitespace-pre-wrap">{`סט מיגון אישי "SafeWork"`}</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Container51 />
      <Heading4 />
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container46 />
      <Container50 />
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,140,0,0.7)] text-right w-[53.66px]">
        <p className="leading-[16px] whitespace-pre-wrap">תיאור מוצע</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular_Italic',sans-serif] h-[23px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-right w-[513.16px]">
        <p className="leading-[22.75px] whitespace-pre-wrap">הסורק לא הצליח לחלץ תיאור מלא מהדף. מומלץ להיכנס לקישור המקור ולהוסיף תיאור ידנית.</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container53 />
      <Container54 />
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#2563eb] text-[12px] text-right w-[256.63px]">
        <p className="leading-[16px] whitespace-pre-wrap">https://supplier-site.com/p/safety-kit-2024</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[5.833px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 5.83333">
        <g id="Container">
          <path d={svgPaths.p32d20280} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container55() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-full items-center relative">
        <Link2 />
        <Container56 />
      </div>
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start pl-[382.7px] pt-[9px] relative w-full">
        <Container55 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Container45 />
      <Container52 />
      <HorizontalBorder2 />
    </div>
  );
}

function Container58() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p2cbc1080} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[rgba(255,140,0,0.2)] content-stretch flex gap-[8px] items-center px-[26px] py-[10px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#ff8c00] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-center w-[123.31px]">
        <p className="leading-[20px] whitespace-pre-wrap">השלמת פרטים חסרים</p>
      </div>
      <Container58 />
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-center w-[33.58px]">
        <p className="leading-[20px] whitespace-pre-wrap">הסרה</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-end pr-[386.43px] relative w-full">
          <Button6 />
          <Button7 />
        </div>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[32px] relative shrink-0 w-full" data-name="Margin">
      <Container57 />
    </div>
  );
}

function Container43() {
  return (
    <div className="relative self-stretch shrink-0 w-[709.34px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between p-[24px] relative size-full">
        <Container44 />
        <Margin2 />
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2410c] text-[10px] text-right w-[70.06px]">
        <p className="leading-[15px] whitespace-pre-wrap">נדרש אימות מחיר</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="h-[10.5px] relative shrink-0 w-[2.333px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 2.33333 10.5">
        <g id="Container">
          <path d={svgPaths.p24ced440} fill="var(--fill-0, #EA580C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayShadowOverlayBlur1() {
  return (
    <div className="absolute backdrop-blur-[4px] bg-[rgba(255,237,213,0.9)] content-stretch flex gap-[4px] items-center px-[8px] py-[4px] right-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] top-[12px]" data-name="Overlay+Shadow+OverlayBlur">
      <Container59 />
      <Container60 />
    </div>
  );
}

function Background2() {
  return (
    <div className="min-h-[240px] relative self-stretch shrink-0 w-[354.66px]" data-name="Background">
      <div aria-hidden="true" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 pointer-events-none">
        <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden">
          <img alt="" className="absolute h-[126.78%] left-0 max-w-none top-[-13.39%] w-full" src={imgBackground1} />
        </div>
        <div className="absolute bg-clip-padding bg-white border-0 border-[transparent] border-solid inset-0 mix-blend-saturation" />
      </div>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <OverlayShadowOverlayBlur1 />
      </div>
    </div>
  );
}

function ProductCard3UncertainData() {
  return (
    <div className="bg-white opacity-80 relative rounded-[12px] shrink-0 w-full" data-name="Product Card 3 (Uncertain data)">
      <div className="content-stretch flex items-start overflow-clip p-[2px] relative rounded-[inherit] w-full">
        <Container43 />
        <Background2 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,140,0,0.2)] border-dashed inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function ProductCardsGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start pb-[16px] relative shrink-0 w-full" data-name="Product Cards Grid">
      <ProductCard />
      <ProductCard1 />
      <ProductCard3UncertainData />
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex flex-col items-center justify-center px-[32px] py-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(255,140,0,0.2),0px_4px_6px_-4px_rgba(255,140,0,0.2)]" data-name="Button:shadow" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[100.34px]">
        <p className="leading-[20px] whitespace-pre-wrap">אישור וסיום סקירה</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#f8f7f5] content-stretch flex flex-col items-center justify-center px-[24px] py-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-center w-[34.2px]">
        <p className="leading-[20px] whitespace-pre-wrap">סגירה</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start relative">
        <Button8 />
        <Button9 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[16px] text-right w-[79.23px]">
        <p className="leading-[24px] whitespace-pre-wrap">סיכום סריקה</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-right w-[252.56px]">
        <p className="leading-[16px] whitespace-pre-wrap">3 מוצרים נמצאו • 2 באיכות גבוהה • 1 דורש התערבות</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container64 />
      <Container65 />
    </div>
  );
}

function Container66() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(255,140,0,0.1)] content-stretch flex flex-col items-end p-[12px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <Container66 />
    </div>
  );
}

function Container62() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Container63 />
        <Overlay />
      </div>
    </div>
  );
}

function BottomActions() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Bottom Actions">
      <div aria-hidden="true" className="absolute border border-[rgba(255,140,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[25px] relative w-full">
          <Container61 />
          <Container62 />
        </div>
      </div>
    </div>
  );
}

function Main() {
  return (
    <div className="max-w-[1100px] relative shrink-0 w-full" data-name="Main">
      <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[inherit] px-[16px] py-[32px] relative w-full">
        <HeroSection />
        <ProductCardsGrid />
        <BottomActions />
      </div>
    </div>
  );
}

function MainMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 px-[90px] right-0 top-[65px]" data-name="Main:margin">
      <Main />
    </div>
  );
}

function Container67() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-center w-[319.81px]">
          <p className="leading-[16px] whitespace-pre-wrap">מערכת ניהול ספקים חכמה © 2024 • הופעל על ידי בינה מלאכותית</p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[32px] pt-[33px] px-[80px] relative w-full">
        <Container67 />
      </div>
    </div>
  );
}

function FooterMargin() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col h-[123.25px] items-start justify-end left-0 min-h-[81px] pt-[42.25px] right-0" data-name="Footer:margin">
      <Footer />
    </div>
  );
}

function Background3() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[40px]" data-name="Background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBackground2} />
      </div>
      <div className="-translate-y-1/2 absolute bg-[rgba(255,255,255,0)] right-0 rounded-[9999px] shadow-[0px_0px_0px_2px_rgba(255,140,0,0.2)] size-[40px] top-1/2" data-name="Overlay+Shadow" />
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[21px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[43.86px]">
        <p className="leading-[21px] whitespace-pre-wrap">הגדרות</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[21px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[39.11px]">
        <p className="leading-[21px] whitespace-pre-wrap">מוצרים</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="content-stretch flex flex-col items-end pb-[6px] relative shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#ff8c00] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[21px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-right w-[36.47px]">
        <p className="leading-[21px] whitespace-pre-wrap">ספקים</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[21px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[48.25px]">
        <p className="leading-[21px] whitespace-pre-wrap">דף הבית</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex gap-[36px] items-center relative shrink-0" data-name="Nav">
      <Link3 />
      <Link4 />
      <Link5 />
      <Link6 />
    </div>
  );
}

function Container68() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative z-[2]" data-name="Container">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[32px] items-center justify-end pr-[640.98px] relative w-full">
          <Background3 />
          <Nav />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[23px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[18px] text-right tracking-[-0.27px] w-[83.33px]">
        <p className="leading-[22.5px] whitespace-pre-wrap">ניהול ספקים</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p643d217} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Background">
      <Container70 />
    </div>
  );
}

function Container69() {
  return (
    <div className="relative shrink-0 z-[1]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Heading1 />
        <Background4 />
      </div>
    </div>
  );
}

function HeaderTopNavigationBar() {
  return (
    <div className="absolute bg-white content-stretch flex isolate items-center justify-between left-0 pb-[13px] pt-[12px] px-[80px] right-0 top-0" data-name="Header - Top Navigation Bar">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Container68 />
      <Container69 />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[1500px] relative shrink-0 w-full z-[1]" data-name="Container">
      <MainMargin />
      <FooterMargin />
      <HeaderTopNavigationBar />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#f8f7f5] content-stretch flex flex-col isolate items-start relative size-full" data-name="מוצרים מוצעים מסריקה - עם תווית">
      <Background />
      <Container />
    </div>
  );
}