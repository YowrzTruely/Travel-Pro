import imgBackground from "figma:asset/3156a5334ba2e85a36b93a08a140bd88a4dacc80.png";
import imgBackground1 from "figma:asset/3855c5823fa7b1bc9d6be7096f3fb9e2fde8a725.png";
import imgImage from "figma:asset/243298721546b5ed3cd8adf6bcb99ca1943ff53b.png";
import imgBackground2 from "figma:asset/fb4bcf43b793529e50061aa194eed69e9043a40d.png";
import svgPaths from "./svg-ftq7cqozpq";

function Background() {
  return (
    <div
      className="relative z-[2] flex w-full shrink-0 flex-col content-stretch items-center bg-[#ff8c00] py-[8px]"
      data-name="Background"
    >
      <div
        className="absolute inset-0 bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[20px] w-[250.14px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[14px] text-white not-italic leading-[0] tracking-[0.35px]">
        <p className="whitespace-pre-wrap leading-[20px]">
          SCREEN LABEL: מוצרים מוצעים מסריקה
        </p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[134.75px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[12px] uppercase not-italic leading-[0] tracking-[0.6px]">
        <p className="whitespace-pre-wrap leading-[16px]">
          סריקה אוטומטית הושלמה
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative size-[12.833px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 12.8333 12.8333"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p6da9c80} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[8px] pl-[911.23px]">
          <Container2 />
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 1"
    >
      <div className="relative flex h-[45px] w-[378.58px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[36px] not-italic leading-[0] tracking-[-1.188px]">
        <p className="whitespace-pre-wrap leading-[45px]">
          מוצרים מוצעים מסריקת אתר
        </p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div
      className="relative flex w-[672px] max-w-[672px] shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[56px] w-[663.48px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[18px] not-italic leading-[28px]">
        <p className="mb-0">
          האלגוריתם שלנו זיהה מוצרים חדשים באתר הספק. באפשרותך לאשר אותם להוספה
          לקטלוג,
        </p>
        <p>לערוך את הפרטים או להסיר פריטים שאינם רלוונטיים.</p>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end gap-[8px]"
      data-name="Hero Section"
    >
      <Container1 />
      <Heading />
      <Container4 />
    </div>
  );
}

function Container9() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[61.92px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-[rgba(255,140,0,0.7)] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">הערכת מחיר</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Container9 />
      <div className="relative flex h-[32px] w-[103.69px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] text-[#ff8c00] text-[24px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">₪849.00</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[75.63px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-[rgba(255,140,0,0.7)] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">שם מוצר שזוהה</p>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[28px] w-[268.19px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold','Arimo:Bold',sans-serif] font-bold text-[#181510] text-[20px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">
          מקדחה נטענת 18V - Brushless
        </p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Container11 />
      <Heading2 />
    </div>
  );
}

function Container7() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-between"
      data-name="Container"
    >
      <Container8 />
      <Container10 />
    </div>
  );
}

function Container13() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[53.66px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-[rgba(255,140,0,0.7)] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">תיאור מוצע</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[46px] w-[620.64px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[22.75px]">
        <p className="mb-0">
          מקדחת אימפקט מקצועית מסדרת ה-XR, מנוע ללא פחמים לאורך חיים ממושך, כולל
          2 סוללות 5.0Ah ומטען מהיר
        </p>
        <p>במזוודה קשיחה.</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[7.375px]"
      data-name="Container"
    >
      <Container13 />
      <Container14 />
    </div>
  );
}

function Container16() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[95.33px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">כלי עבודה חשמליים</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div
      className="relative h-[11.667px] w-[11.083px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.0833 11.6667"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.pd995200} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Container">
      <div className="relative flex h-full content-stretch items-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Link"
    >
      <div className="relative flex h-[16px] w-[229.73px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal text-[#2563eb] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">
          https://supplier-site.com/tools/drill-v18
        </p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div
      className="relative h-[5.833px] w-[11.667px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6667 5.83333"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p32d20280}
            fill="var(--fill-0, #8D785E)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Container">
      <div className="relative flex h-full content-stretch items-center gap-[8.01px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Link />
        <Container19 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative w-full shrink-0" data-name="HorizontalBorder">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.05)] border-t border-solid"
      />
      <div className="relative flex w-full content-stretch items-start gap-[24px] pt-[9px] pl-[269.58px]">
        <Container15 />
        <Container18 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[16px]"
      data-name="Container"
    >
      <Container7 />
      <Container12 />
      <HorizontalBorder />
    </div>
  );
}

function Container21() {
  return (
    <div className="relative size-[11.667px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6667 11.6667"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p1d9bcc00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[8px] bg-[#ff8c00] px-[24px] py-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      data-name="Button"
    >
      <div className="relative flex h-[20px] w-[63.33px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[14px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">אישור מוצר</p>
      </div>
      <Container21 />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative size-[10.5px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10.5 10.5"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p2cbc1080}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[8px] bg-[rgba(255,140,0,0.1)] px-[16px] py-[8px]"
      data-name="Button"
    >
      <div className="relative flex h-[20px] w-[74.14px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">עריכת פרטים</p>
      </div>
      <Container22 />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] px-[16px] py-[8px]"
      data-name="Button"
    >
      <div className="relative flex h-[20px] w-[33.58px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">הסרה</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center justify-end">
        <div className="relative flex w-full content-stretch items-center justify-end gap-[12px] pr-[311.59px]">
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
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start pt-[32px]"
      data-name="Margin"
    >
      <Container20 />
    </div>
  );
}

function Container5() {
  return (
    <div
      className="relative w-[710.67px] shrink-0 self-stretch"
      data-name="Container"
    >
      <div className="relative flex size-full flex-col content-stretch items-start justify-between border-0 border-[transparent] border-solid bg-clip-padding p-[24px]">
        <Container6 />
        <Margin />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[15px] w-[45.16px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#15803d] text-[10px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[15px]">ביטחון גבוה</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div
      className="relative h-[12.25px] w-[12.833px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 12.8333 12.25"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p26f9d500}
            fill="var(--fill-0, #16A34A)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function OverlayShadowOverlayBlur() {
  return (
    <div
      className="absolute top-[12px] right-[12px] flex content-stretch items-center gap-[3.99px] rounded-[8px] bg-[rgba(255,255,255,0.9)] px-[8px] py-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[4px]"
      data-name="Overlay+Shadow+OverlayBlur"
    >
      <Container23 />
      <Container24 />
    </div>
  );
}

function Background1() {
  return (
    <div
      className="relative min-h-[240px] w-[355.33px] shrink-0 self-stretch"
      data-name="Background"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden border-0 border-[transparent] border-solid bg-clip-padding">
        <img
          alt=""
          className="absolute top-[-9.52%] left-0 h-[119.04%] w-full max-w-none"
          height="600"
          src={imgBackground}
          width="800"
        />
      </div>
      <div className="relative size-full border-0 border-[transparent] border-solid bg-clip-padding">
        <OverlayShadowOverlayBlur />
      </div>
    </div>
  );
}

function ProductCard() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Product Card 1"
    >
      <div className="relative flex w-full content-stretch items-start overflow-clip rounded-[inherit] p-px">
        <Container5 />
        <Background1 />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,140,0,0.1)] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
    </div>
  );
}

function Container29() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[61.92px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-[rgba(255,140,0,0.7)] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">הערכת מחיר</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Container29 />
      <div className="relative flex h-[32px] w-[124.09px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] text-[#ff8c00] text-[24px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">₪1,250.00</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[75.63px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-[rgba(255,140,0,0.7)] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">שם מוצר שזוהה</p>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[28px] w-[211.59px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[20px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">
          ארון כלים מודולרי 7 מגירות
        </p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Container31 />
      <Heading3 />
    </div>
  );
}

function Container27() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-between"
      data-name="Container"
    >
      <Container28 />
      <Container30 />
    </div>
  );
}

function Container33() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[53.66px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-[rgba(255,140,0,0.7)] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">תיאור מוצע</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[46px] w-[629.26px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[22.75px]">
        <p className="mb-0">
          מערכת אחסון מקצועית למוסכים וסדנאות. עשוי פלדה עמידה עם ציפוי נגד
          חלודה, גלגלים מחוזקים עם נעילה ומנגנון
        </p>
        <p>מניעת פתיחה כפולה.</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[7.375px]"
      data-name="Container"
    >
      <Container33 />
      <Container34 />
    </div>
  );
}

function Container36() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[69.06px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">פתרונות אחסון</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div
      className="relative h-[11.667px] w-[11.083px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.0833 11.6667"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.pd995200} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Container">
      <div className="relative flex h-full content-stretch items-center gap-[8.01px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container36 />
        <Container37 />
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Link"
    >
      <div className="relative flex h-[16px] w-[278.63px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal text-[#2563eb] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">
          https://supplier-site.com/storage/cabinet-7drw
        </p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div
      className="relative h-[5.833px] w-[11.667px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6667 5.83333"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p32d20280}
            fill="var(--fill-0, #8D785E)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Container">
      <div className="relative flex h-full content-stretch items-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Link1 />
        <Container39 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative w-full shrink-0" data-name="HorizontalBorder">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.05)] border-t border-solid"
      />
      <div className="relative flex w-full content-stretch items-start gap-[24px] pt-[9px] pl-[246.95px]">
        <Container35 />
        <Container38 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[16px]"
      data-name="Container"
    >
      <Container27 />
      <Container32 />
      <HorizontalBorder1 />
    </div>
  );
}

function Container41() {
  return (
    <div className="relative size-[11.667px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6667 11.6667"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p1d9bcc00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[8px] bg-[#ff8c00] px-[24px] py-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      data-name="Button"
    >
      <div className="relative flex h-[20px] w-[63.33px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[14px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">אישור מוצר</p>
      </div>
      <Container41 />
    </div>
  );
}

function Container42() {
  return (
    <div className="relative size-[10.5px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10.5 10.5"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p2cbc1080}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[8px] bg-[rgba(255,140,0,0.1)] px-[16px] py-[8px]"
      data-name="Button"
    >
      <div className="relative flex h-[20px] w-[74.14px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">עריכת פרטים</p>
      </div>
      <Container42 />
    </div>
  );
}

function Button5() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] px-[16px] py-[8px]"
      data-name="Button"
    >
      <div className="relative flex h-[20px] w-[33.58px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">הסרה</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center justify-end">
        <div className="relative flex w-full content-stretch items-center justify-end gap-[12px] pr-[311.59px]">
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
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start pt-[32px]"
      data-name="Margin"
    >
      <Container40 />
    </div>
  );
}

function Container25() {
  return (
    <div
      className="relative w-[710.67px] shrink-0 self-stretch"
      data-name="Container"
    >
      <div className="relative flex size-full flex-col content-stretch items-start justify-between border-0 border-[transparent] border-solid bg-clip-padding p-[24px]">
        <Container26 />
        <Margin1 />
      </div>
    </div>
  );
}

function ProductCard1() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Product Card 2"
    >
      <div className="relative flex w-full content-stretch items-start overflow-clip rounded-[inherit] p-px">
        <Container25 />
        <div
          className="relative min-h-[240px] w-[355.33px] shrink-0 self-stretch"
          data-name="Image"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden border-0 border-[transparent] border-solid bg-clip-padding">
            <img
              alt=""
              className="absolute top-[-9.52%] left-0 h-[119.04%] w-full max-w-none"
              height="600"
              src={imgImage}
              width="800"
            />
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,140,0,0.1)] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
    </div>
  );
}

function Container47() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[61.92px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-[rgba(255,140,0,0.7)] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">הערכת מחיר</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <div className="relative flex h-[32px] w-[63.98px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] text-[24px] text-[rgba(255,140,0,0.6)] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">₪ ???</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-center"
      data-name="Container"
    >
      <Container49 />
    </div>
  );
}

function Container46() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Container47 />
      <Container48 />
    </div>
  );
}

function Container51() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[75.63px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-[rgba(255,140,0,0.7)] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">שם מוצר שזוהה</p>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[28px] w-[221.63px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold','Arimo:Bold',sans-serif] font-bold text-[#181510] text-[20px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">{`סט מיגון אישי "SafeWork"`}</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Container51 />
      <Heading4 />
    </div>
  );
}

function Container45() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-between"
      data-name="Container"
    >
      <Container46 />
      <Container50 />
    </div>
  );
}

function Container53() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[53.66px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-[rgba(255,140,0,0.7)] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">תיאור מוצע</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[23px] w-[513.16px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular_Italic',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[22.75px]">
          הסורק לא הצליח לחלץ תיאור מלא מהדף. מומלץ להיכנס לקישור המקור ולהוסיף
          תיאור ידנית.
        </p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[8px]"
      data-name="Container"
    >
      <Container53 />
      <Container54 />
    </div>
  );
}

function Link2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Link"
    >
      <div className="relative flex h-[16px] w-[256.63px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal text-[#2563eb] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">
          https://supplier-site.com/p/safety-kit-2024
        </p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div
      className="relative h-[5.833px] w-[11.667px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6667 5.83333"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p32d20280}
            fill="var(--fill-0, #8D785E)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Container">
      <div className="relative flex h-full content-stretch items-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Link2 />
        <Container56 />
      </div>
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="relative w-full shrink-0" data-name="HorizontalBorder">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.05)] border-t border-solid"
      />
      <div className="relative flex w-full content-stretch items-start pt-[9px] pl-[382.7px]">
        <Container55 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[16px]"
      data-name="Container"
    >
      <Container45 />
      <Container52 />
      <HorizontalBorder2 />
    </div>
  );
}

function Container58() {
  return (
    <div className="relative size-[10.5px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10.5 10.5"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p2cbc1080}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[8px] bg-[rgba(255,140,0,0.2)] px-[26px] py-[10px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-[#ff8c00] border-solid"
      />
      <div className="relative flex h-[20px] w-[123.31px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">השלמת פרטים חסרים</p>
      </div>
      <Container58 />
    </div>
  );
}

function Button7() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] px-[16px] py-[8px]"
      data-name="Button"
    >
      <div className="relative flex h-[20px] w-[33.58px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">הסרה</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center justify-end">
        <div className="relative flex w-full content-stretch items-center justify-end gap-[12px] pr-[386.43px]">
          <Button6 />
          <Button7 />
        </div>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start pt-[32px]"
      data-name="Margin"
    >
      <Container57 />
    </div>
  );
}

function Container43() {
  return (
    <div
      className="relative w-[709.34px] shrink-0 self-stretch"
      data-name="Container"
    >
      <div className="relative flex size-full flex-col content-stretch items-start justify-between border-0 border-[transparent] border-solid bg-clip-padding p-[24px]">
        <Container44 />
        <Margin2 />
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[15px] w-[70.06px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#c2410c] text-[10px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[15px]">נדרש אימות מחיר</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div
      className="relative h-[10.5px] w-[2.333px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2.33333 10.5"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p24ced440}
            fill="var(--fill-0, #EA580C)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function OverlayShadowOverlayBlur1() {
  return (
    <div
      className="absolute top-[12px] right-[12px] flex content-stretch items-center gap-[4px] rounded-[8px] bg-[rgba(255,237,213,0.9)] px-[8px] py-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[4px]"
      data-name="Overlay+Shadow+OverlayBlur"
    >
      <Container59 />
      <Container60 />
    </div>
  );
}

function Background2() {
  return (
    <div
      className="relative min-h-[240px] w-[354.66px] shrink-0 self-stretch"
      data-name="Background"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-0 border-[transparent] border-solid bg-clip-padding"
      >
        <div className="absolute inset-0 overflow-hidden border-0 border-[transparent] border-solid bg-clip-padding">
          <img
            alt=""
            className="absolute top-[-13.39%] left-0 h-[126.78%] w-full max-w-none"
            height="600"
            src={imgBackground1}
            width="800"
          />
        </div>
        <div className="absolute inset-0 border-0 border-[transparent] border-solid bg-white bg-clip-padding mix-blend-saturation" />
      </div>
      <div className="relative size-full border-0 border-[transparent] border-solid bg-clip-padding">
        <OverlayShadowOverlayBlur1 />
      </div>
    </div>
  );
}

function ProductCard3UncertainData() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white opacity-80"
      data-name="Product Card 3 (Uncertain data)"
    >
      <div className="relative flex w-full content-stretch items-start overflow-clip rounded-[inherit] p-[2px]">
        <Container43 />
        <Background2 />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border-2 border-[rgba(255,140,0,0.2)] border-dashed"
      />
    </div>
  );
}

function ProductCardsGrid() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[24px] pb-[16px]"
      data-name="Product Cards Grid"
    >
      <ProductCard />
      <ProductCard1 />
      <ProductCard3UncertainData />
    </div>
  );
}

function Button8() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] bg-[#ff8c00] px-[32px] py-[12px]"
      data-name="Button"
    >
      <div
        className="absolute inset-0 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(255,140,0,0.2),0px_4px_6px_-4px_rgba(255,140,0,0.2)]"
        data-name="Button:shadow"
      />
      <div className="relative flex h-[20px] w-[100.34px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[14px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">אישור וסיום סקירה</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] bg-[#f8f7f5] px-[24px] py-[12px]"
      data-name="Button"
    >
      <div className="relative flex h-[20px] w-[34.2px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">סגירה</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-start gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Button8 />
        <Button9 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[79.23px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">סיכום סריקה</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[252.56px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">
          3 מוצרים נמצאו • 2 באיכות גבוהה • 1 דורש התערבות
        </p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <Container64 />
      <Container65 />
    </div>
  );
}

function Container66() {
  return (
    <div className="relative size-[18px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end rounded-[9999px] bg-[rgba(255,140,0,0.1)] p-[12px]"
      data-name="Overlay"
    >
      <Container66 />
    </div>
  );
}

function Container62() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container63 />
        <Overlay />
      </div>
    </div>
  );
}

function BottomActions() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Bottom Actions"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,140,0,0.1)] border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between p-[25px]">
          <Container61 />
          <Container62 />
        </div>
      </div>
    </div>
  );
}

function Main() {
  return (
    <div className="relative w-full max-w-[1100px] shrink-0" data-name="Main">
      <div className="relative flex w-full max-w-[inherit] flex-col content-stretch items-start gap-[32px] px-[16px] py-[32px]">
        <HeroSection />
        <ProductCardsGrid />
        <BottomActions />
      </div>
    </div>
  );
}

function MainMargin() {
  return (
    <div
      className="absolute top-[65px] right-0 left-0 flex flex-col content-stretch items-start px-[90px]"
      data-name="Main:margin"
    >
      <Main />
    </div>
  );
}

function Container67() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-center border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[16px] w-[319.81px] shrink-0 flex-col justify-center text-center font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[16px]">
            מערכת ניהול ספקים חכמה © 2024 • הופעל על ידי בינה מלאכותית
          </p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="relative w-full shrink-0" data-name="Footer">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.05)] border-t border-solid"
      />
      <div className="relative flex w-full flex-col content-stretch items-start px-[80px] pt-[33px] pb-[32px]">
        <Container67 />
      </div>
    </div>
  );
}

function FooterMargin() {
  return (
    <div
      className="absolute right-0 bottom-0 left-0 flex h-[123.25px] min-h-[81px] flex-col content-stretch items-start justify-end pt-[42.25px]"
      data-name="Footer:margin"
    >
      <Footer />
    </div>
  );
}

function Background3() {
  return (
    <div
      className="relative size-[40px] shrink-0 rounded-[9999px]"
      data-name="Background"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[9999px]">
        <img
          alt=""
          className="absolute top-0 left-0 size-full max-w-none"
          height="600"
          src={imgBackground2}
          width="800"
        />
      </div>
      <div
        className="absolute top-1/2 right-0 size-[40px] -translate-y-1/2 rounded-[9999px] bg-[rgba(255,255,255,0)] shadow-[0px_0px_0px_2px_rgba(255,140,0,0.2)]"
        data-name="Overlay+Shadow"
      />
    </div>
  );
}

function Link3() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Link"
    >
      <div className="relative flex h-[21px] w-[43.86px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[21px]">הגדרות</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Link"
    >
      <div className="relative flex h-[21px] w-[39.11px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[21px]">מוצרים</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end pb-[6px]"
      data-name="Link"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#ff8c00] border-b-2 border-solid"
      />
      <div className="relative flex h-[21px] w-[36.47px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[21px]">ספקים</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Link"
    >
      <div className="relative flex h-[21px] w-[48.25px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[21px]">דף הבית</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[36px]"
      data-name="Nav"
    >
      <Link3 />
      <Link4 />
      <Link5 />
      <Link6 />
    </div>
  );
}

function Container68() {
  return (
    <div
      className="relative z-[2] min-h-px min-w-px flex-[1_0_0]"
      data-name="Container"
    >
      <div className="flex size-full flex-row items-center justify-end">
        <div className="relative flex w-full content-stretch items-center justify-end gap-[32px] border-0 border-[transparent] border-solid bg-clip-padding pr-[640.98px]">
          <Background3 />
          <Nav />
        </div>
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
      <div className="relative flex h-[23px] w-[83.33px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[18px] not-italic leading-[0] tracking-[-0.27px]">
        <p className="whitespace-pre-wrap leading-[22.5px]">ניהול ספקים</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="relative size-[20px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p643d217} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#ff8c00]"
      data-name="Background"
    >
      <Container70 />
    </div>
  );
}

function Container69() {
  return (
    <div className="relative z-[1] shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Heading1 />
        <Background4 />
      </div>
    </div>
  );
}

function HeaderTopNavigationBar() {
  return (
    <div
      className="absolute top-0 right-0 left-0 isolate flex content-stretch items-center justify-between bg-white px-[80px] pt-[12px] pb-[13px]"
      data-name="Header - Top Navigation Bar"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.1)] border-b border-solid"
      />
      <Container68 />
      <Container69 />
    </div>
  );
}

function Container() {
  return (
    <div
      className="relative z-[1] h-[1500px] w-full shrink-0"
      data-name="Container"
    >
      <MainMargin />
      <FooterMargin />
      <HeaderTopNavigationBar />
    </div>
  );
}

export default function Component() {
  return (
    <div
      className="relative isolate flex size-full flex-col content-stretch items-start bg-[#f8f7f5]"
      data-name="מוצרים מוצעים מסריקה - עם תווית"
    >
      <Background />
      <Container />
    </div>
  );
}
