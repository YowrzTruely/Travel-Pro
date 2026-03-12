import imgWinery from "figma:asset/5ec9418d8feabf6e070a7f3335428b1fa8b3d0c2.png";
import imgDining from "figma:asset/36d363ebb10cc18a4f7f98f45bc555fc6d0f6935.png";
import img from "figma:asset/ad79f1607b35470b947bef516ed84cef936f0a03.png";
import imgTransport from "figma:asset/ded76283875a946982cffc8876b9d52b7966e6db.png";
import svgPaths from "./svg-srow9czikn";

function BackgroundHorizontalBorder() {
  return (
    <div
      className="absolute top-0 right-0 left-0 flex flex-col content-stretch items-center bg-[#0f172a] pt-[8px] pb-[9px]"
      data-name="Background+HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.2)] border-b border-solid"
      />
      <div className="relative flex h-[20px] w-[239.72px] shrink-0 flex-col justify-center text-center font-['Plus_Jakarta_Sans:Bold','Arimo:Bold',sans-serif] font-bold text-[14px] text-white uppercase leading-[0] tracking-[1.4px]">
        <p className="whitespace-pre-wrap leading-[20px]">
          SCREEN LABEL: דף הצעה ללקוח
        </p>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div
      className="relative min-h-px w-full min-w-px flex-[1_0_0]"
      data-name="גליל עליון"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute top-[-66.67%] left-0 h-[233.33%] w-full max-w-none"
          height="600"
          src={img}
          width="800"
        />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div
      className="absolute inset-[0_0_0.25px_0] flex flex-col content-stretch items-start justify-center"
      data-name="Container"
    >
      <Component1 />
      <div
        className="absolute inset-0 bg-gradient-to-l from-[rgba(35,26,15,0.8)] via-1/2 via-[rgba(35,26,15,0.4)] to-[rgba(35,26,15,0)]"
        data-name="Gradient"
      />
    </div>
  );
}

function Overlay() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-start justify-end rounded-[9999px] bg-[rgba(255,140,0,0.2)] px-[16px] py-[4px]"
      data-name="Overlay"
    >
      <div className="relative flex h-[20px] w-[68.8px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">יוצאים לדרך</p>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 2"
    >
      <div className="relative flex h-[96px] w-[421.02px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Semi_Bold',sans-serif] text-[48px] text-white not-italic leading-[48px]">
        <p className="mb-0">החוויה הגלילית שלכם</p>
        <p>מתחילה כאן</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end pt-[8px]"
      data-name="Container"
    >
      <div className="relative flex h-[88px] w-[518.92px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Regular_Italic',sans-serif] text-[#f1f5f9] text-[18px] not-italic leading-[29.25px]">
        <p className="mb-0">{`"בין הרים ירוקים, יקבי בוטיק וניחוחות של טבע פראי, הרכבנו עבורכם מסע`}</p>
        <p className="mb-0">
          שכולו התחדשות, גיבוש ופינוק בלתי מתפשר. הגליל העליון מחכה לכם עם
        </p>
        <p>{`שקט עוצמתי וחוויות קולינריות בלתי נשכחות."`}</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div
      className="relative flex max-w-[672px] shrink-0 flex-col content-stretch items-end gap-[16px] p-[64px]"
      data-name="Container"
    >
      <Overlay />
      <Heading1 />
      <Container2 />
    </div>
  );
}

function SectionHeroIntro() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[24px]"
      data-name="Section - Hero & Intro"
    >
      <div className="flex size-full flex-row items-center overflow-clip rounded-[inherit]">
        <div className="relative flex w-full content-stretch items-center pt-[50.13px] pb-[50.12px] pl-[448px]">
          <Container />
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[32px] w-[105.97px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[24px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">{`לו"ז מקוצר`}</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[16px] pl-[992.03px]">
          <Heading2 />
          <div
            className="h-[32px] w-[6px] shrink-0 rounded-[9999px] bg-[#ff8c00]"
            data-name="Background"
          />
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[91.02px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#ff8c00] text-[14px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">15:30 - 18:00</p>
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 4">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[170px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[18px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">{`סדנת גיבוש ומסע ג'יפים`}</p>
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[191.48px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">
            אקשן ונופים מרהיבים בנחלי הגליל.
          </p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div
      className="relative flex w-[357.34px] shrink-0 flex-col content-stretch items-start gap-[8px] self-stretch rounded-[16px] bg-white p-[25px]"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#f1f5f9] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <Container5 />
      <Heading3 />
      <Container6 />
    </div>
  );
}

function Container7() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[92.08px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#ff8c00] text-[14px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">13:00 - 15:00</p>
        </div>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 4">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[129.58px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[18px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">ארוחת צהריים שף</p>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[285.25px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">{`חוויה קולינרית "מהחווה לשולחן" תחת כיפת השמיים.`}</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div
      className="relative flex w-[357.33px] shrink-0 flex-col content-stretch items-start gap-[8px] self-stretch rounded-[16px] bg-white p-[25px]"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#f1f5f9] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <Container7 />
      <Heading4 />
      <Container8 />
    </div>
  );
}

function Container9() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[95.98px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#ff8c00] text-[14px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">09:00 - 12:00</p>
        </div>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 4">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[130.84px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[18px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">
            סיור יקבים וטעימות
          </p>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[230.8px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">
            פתיחת הבוקר בכרמים הירוקים של הגליל.
          </p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div
      className="relative flex w-[357.33px] shrink-0 flex-col content-stretch items-start gap-[8px] self-stretch rounded-[16px] bg-white p-[25px]"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#f1f5f9] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <Container9 />
      <Heading5 />
      <Container10 />
    </div>
  );
}

function Container4() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-center gap-[24px]"
      data-name="Container"
    >
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
      <BackgroundBorderShadow2 />
    </div>
  );
}

function SectionItinerarySummary() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[32px]"
      data-name="Section - Itinerary Summary"
    >
      <Container3 />
      <Container4 />
    </div>
  );
}

function Heading6() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[32px] w-[148.83px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[24px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">פירוט הפעילויות</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[16px] pl-[949.17px]">
          <Heading6 />
          <div
            className="h-[32px] w-[6px] shrink-0 rounded-[9999px] bg-[#ff8c00]"
            data-name="Background"
          />
        </div>
      </div>
    </div>
  );
}

function Winery() {
  return (
    <div
      className="relative min-h-px w-full min-w-px flex-[1_0_0] rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]"
      data-name="Winery"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[16px]">
        <img
          alt=""
          className="absolute top-[-3.13%] left-0 h-[106.25%] w-full max-w-none"
          height="600"
          src={imgWinery}
          width="800"
        />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className="relative flex h-[256px] w-[272px] shrink-0 flex-col content-stretch items-start justify-center"
      data-name="Container"
    >
      <Winery />
    </div>
  );
}

function Container15() {
  return (
    <div className="relative h-[13.5px] w-[9px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 9 13.5"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p5da9840} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[8px] pl-[692.66px]">
          <div className="relative flex h-[20px] w-[97.34px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] uppercase not-italic leading-[0] tracking-[0.7px]">
            <p className="whitespace-pre-wrap leading-[20px]">יקב רמות נפתלי</p>
          </div>
          <Container15 />
        </div>
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[33px] w-[332.27px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#0f172a] text-[24px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[33px]">
          סיור כרמים, טעימות יין וגבינות בוטיק
        </p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[52px] w-[808.64px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Regular',sans-serif] text-[#475569] text-[16px] not-italic leading-[26px]">
        <p className="mb-0">
          ניכנס אל לב תעשיית היין הגלילית. הסיור כולל מפגש מרתק עם היינן, הסברים
          על תהליך הייצור הייחודי לאזור הגליל העליון, וטעימה
        </p>
        <p>מודרכת של 5 סוגי יינות עטורי פרסים.</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[327.47px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#334155] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">{`קבלת פנים עם יין רוזה צונן ופוקאצ'ות חמות מהטאבון.`}</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative size-[11.648px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6484 11.6484"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3c62aa00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Margin() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start pt-[4px]"
      data-name="Margin"
    >
      <Container18 />
    </div>
  );
}

function Item() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="relative flex w-full content-stretch items-start gap-[12px] pl-[462.53px]">
        <Container17 />
        <Margin />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[296.22px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#334155] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          פלטת גבינות צאן מקומיות, אגוזים ופירות העונה.
        </p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative size-[11.648px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6484 11.6484"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3c62aa00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Margin1() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start pt-[4px]"
      data-name="Margin"
    >
      <Container20 />
    </div>
  );
}

function Item1() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="relative flex w-full content-stretch items-start gap-[12px] pl-[493.78px]">
        <Container19 />
        <Margin1 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[252.95px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#334155] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          סיור רגלי קל בכרמים המקיפים את היקב.
        </p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative size-[11.648px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6484 11.6484"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3c62aa00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Margin2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start pt-[4px]"
      data-name="Margin"
    >
      <Container22 />
    </div>
  );
}

function Item2() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="relative flex w-full content-stretch items-start gap-[12px] pl-[537.05px]">
        <Container21 />
        <Margin2 />
      </div>
    </div>
  );
}

function List() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[12px]"
      data-name="List"
    >
      <Item />
      <Item1 />
      <Item2 />
    </div>
  );
}

function Container13() {
  return (
    <div
      className="relative flex w-[816px] shrink-0 flex-col content-stretch items-start gap-[16px]"
      data-name="Container"
    >
      <Container14 />
      <Heading7 />
      <Container16 />
      <List />
    </div>
  );
}

function Activity() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start gap-[32px]"
      data-name="Activity 1"
    >
      <Container12 />
      <Container13 />
    </div>
  );
}

function Dining() {
  return (
    <div
      className="relative min-h-px w-full min-w-px flex-[1_0_0] rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]"
      data-name="Dining"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[16px]">
        <img
          alt=""
          className="absolute top-[-3.13%] left-0 h-[106.25%] w-full max-w-none"
          height="600"
          src={imgDining}
          width="800"
        />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div
      className="relative h-[256px] w-[272px] shrink-0"
      data-name="Container"
    >
      <div className="relative flex size-full flex-col content-stretch items-start justify-center border-0 border-[transparent] border-solid bg-clip-padding">
        <Dining />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div
      className="relative h-[14.977px] w-[13.5px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13.5 14.9766"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p85e4600} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[8px] pl-[695.7px]">
          <div className="relative flex h-[20px] w-[94.3px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] uppercase not-italic leading-[0] tracking-[0.7px]">
            <p className="whitespace-pre-wrap leading-[20px]">השף אייל גלילי</p>
          </div>
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[33px] w-[321.53px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#0f172a] text-[24px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[33px]">{`ארוחת צהריים "גליל פראי" בטבע`}</p>
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
      <div className="relative flex h-[52px] w-[786.64px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Regular',sans-serif] text-[#475569] text-[16px] not-italic leading-[26px]">
        <p className="mb-0">
          חוויה קולינרית המבוססת על ליקוט עונתי וחומרי גלם טריים ביותר. שולחן
          אבירים ארוך יחכה לכם תחת עצי אלון עתיקים, עם מנות
        </p>
        <p>שיוצאות היישר מהגריל והמעשנה.</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[317.95px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#334155] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          תפריט בשרי עשיר (קיים מענה לצמחונים/טבעונים).
        </p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative size-[11.648px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6484 11.6484"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3c62aa00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Margin3() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start pt-[4px]"
      data-name="Margin"
    >
      <Container29 />
    </div>
  );
}

function Item3() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="relative flex w-full content-stretch items-start gap-[12px] pl-[472.05px]">
        <Container28 />
        <Margin3 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[265.75px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#334155] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          סלטים חיים עם שמן זית מבית הבד המקומי.
        </p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="relative size-[11.648px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6484 11.6484"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3c62aa00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Margin4() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start pt-[4px]"
      data-name="Margin"
    >
      <Container31 />
    </div>
  );
}

function Item4() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="relative flex w-full content-stretch items-start gap-[12px] pl-[524.25px]">
        <Container30 />
        <Margin4 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[228.22px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#334155] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          קינוחי שוקולד ופירות יער בסגנון ביתי.
        </p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative size-[11.648px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6484 11.6484"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3c62aa00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Margin5() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start pt-[4px]"
      data-name="Margin"
    >
      <Container33 />
    </div>
  );
}

function Item5() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="relative flex w-full content-stretch items-start gap-[12px] pl-[561.78px]">
        <Container32 />
        <Margin5 />
      </div>
    </div>
  );
}

function List1() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[12px]"
      data-name="List"
    >
      <Item3 />
      <Item4 />
      <Item5 />
    </div>
  );
}

function Container24() {
  return (
    <div className="relative w-[816px] shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container25 />
        <Heading8 />
        <Container27 />
        <List1 />
      </div>
    </div>
  );
}

function Activity1() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start gap-[32px] pt-[49px]"
      data-name="Activity 2"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e2e8f0] border-t border-solid"
      />
      <Container23 />
      <Container24 />
    </div>
  );
}

function Transport() {
  return (
    <div
      className="relative min-h-px w-full min-w-px flex-[1_0_0] rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]"
      data-name="Transport"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[16px]">
        <img
          alt=""
          className="absolute top-[-3.13%] left-0 h-[106.25%] w-full max-w-none"
          height="600"
          src={imgTransport}
          width="800"
        />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div
      className="relative h-[256px] w-[272px] shrink-0"
      data-name="Container"
    >
      <div className="relative flex size-full flex-col content-stretch items-start justify-center border-0 border-[transparent] border-solid bg-clip-padding">
        <Transport />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div
      className="relative h-[14.238px] w-[12.023px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 12.0234 14.2383"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p4e0b480} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[7.99px] pl-[645.88px]">
          <div className="relative flex h-[20px] w-[144.13px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#ff8c00] text-[14px] uppercase leading-[0] tracking-[0.7px]">
            <p className="whitespace-pre-wrap leading-[20px]">
              Royal Transport
            </p>
          </div>
          <Container37 />
        </div>
      </div>
    </div>
  );
}

function Heading9() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[33px] w-[281.69px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#0f172a] text-[24px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[33px]">
          הסעות VIP ומעטפת לוגיסטית
        </p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[52px] w-[746.97px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Regular',sans-serif] text-[#475569] text-[16px] not-italic leading-[26px]">
        <p className="mb-0">
          הדרך חשובה לא פחות מהיעד. אנחנו דואגים שתתחילו את החופשה ברגע שתעלו על
          האוטובוס, עם כל הנוחות והפינוקים
        </p>
        <p>האפשריים.</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[368.84px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#334155] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          אוטובוס תיירים חדיש (מודל 2023) עם Wi-Fi ושקעי טעינה.
        </p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative size-[11.648px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6484 11.6484"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3c62aa00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Margin6() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start pt-[4px]"
      data-name="Margin"
    >
      <Container40 />
    </div>
  );
}

function Item6() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="relative flex w-full content-stretch items-start gap-[12px] pl-[421.16px]">
        <Container39 />
        <Margin6 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[335.75px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#334155] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          ערכת פינוק לכל נוסע הכוללת מים מינרליים ונשנושים.
        </p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative size-[11.648px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6484 11.6484"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3c62aa00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Margin7() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start pt-[4px]"
      data-name="Margin"
    >
      <Container42 />
    </div>
  );
}

function Item7() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="relative flex w-full content-stretch items-start gap-[12px] pl-[454.25px]">
        <Container41 />
        <Margin7 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[254.73px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#334155] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          נהג מקצועי המכיר כל עיקול ופינה בגליל.
        </p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative size-[11.648px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6484 11.6484"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3c62aa00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Margin8() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start pt-[4px]"
      data-name="Margin"
    >
      <Container44 />
    </div>
  );
}

function Item8() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="relative flex w-full content-stretch items-start gap-[12px] pl-[535.27px]">
        <Container43 />
        <Margin8 />
      </div>
    </div>
  );
}

function List2() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[12px]"
      data-name="List"
    >
      <Item6 />
      <Item7 />
      <Item8 />
    </div>
  );
}

function Container35() {
  return (
    <div className="relative w-[816px] shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container36 />
        <Heading9 />
        <Container38 />
        <List2 />
      </div>
    </div>
  );
}

function Activity2() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start gap-[32px] pt-[49px]"
      data-name="Activity 3"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e2e8f0] border-t border-solid"
      />
      <Container34 />
      <Container35 />
    </div>
  );
}

function SectionDetailedComponents() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[48px]"
      data-name="Section - Detailed Components"
    >
      <Container11 />
      <Activity />
      <Activity1 />
      <Activity2 />
    </div>
  );
}

function Heading10() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[28px] w-[97.05px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[20px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">חשוב לדעת</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative size-[19.969px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 19.9688 19.9688"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p14f29100}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding pl-[920.95px]">
          <Heading10 />
          <Container46 />
        </div>
      </div>
    </div>
  );
}

function Item9() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="flex size-full flex-row justify-end">
        <div className="relative flex w-full content-stretch items-start justify-end gap-[237.33px] pr-[20px] text-right text-[#475569] text-[14px] leading-[0]">
          <div className="relative flex h-[20px] w-[7px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal">
            <p className="whitespace-pre-wrap leading-[20px]"> </p>
          </div>
          <div className="relative flex h-[20px] w-[246.67px] shrink-0 flex-col justify-center font-['FreeSans:Regular',sans-serif] not-italic">
            <p className="whitespace-pre-wrap leading-[20px]">
              המחיר כולל ביטוח אתגרי לכלל המשתתפים.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Item10() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="flex size-full flex-row justify-end">
        <div className="relative flex w-full content-stretch items-start justify-end gap-[125.72px] pr-[20px] text-right text-[#475569] text-[14px] leading-[0]">
          <div className="relative flex h-[20px] w-[7px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal">
            <p className="whitespace-pre-wrap leading-[20px]"> </p>
          </div>
          <div className="relative flex h-[20px] w-[358.28px] shrink-0 flex-col justify-center font-['FreeSans:Regular',sans-serif] not-italic">
            <p className="whitespace-pre-wrap leading-[20px]">{`יש להצטייד בנעלי הליכה נוחות ובגדים להחלפה למסלול הג'יפים.`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Item11() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="flex size-full flex-row justify-end">
        <div className="relative flex w-full content-stretch items-start justify-end gap-[199.05px] pr-[20px] text-right text-[#475569] text-[14px] leading-[0]">
          <div className="relative flex h-[20px] w-[7px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal">
            <p className="whitespace-pre-wrap leading-[20px]"> </p>
          </div>
          <div className="relative flex h-[20px] w-[284.95px] shrink-0 flex-col justify-center font-['FreeSans:Regular',sans-serif] not-italic">
            <p className="whitespace-pre-wrap leading-[20px]">
              לוחות הזמנים ניתנים לשינוי בהתאם לבקשת הלקוח.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function List3() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-start gap-[8px] self-stretch"
      data-name="List"
    >
      <Item9 />
      <Item10 />
      <Item11 />
    </div>
  );
}

function Item12() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="flex size-full flex-row justify-end">
        <div className="relative flex w-full content-stretch items-start justify-end gap-[257.91px] pr-[20px] text-right text-[#475569] text-[14px] leading-[0]">
          <div className="relative flex h-[20px] w-[7px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal">
            <p className="whitespace-pre-wrap leading-[20px]"> </p>
          </div>
          <div className="relative flex h-[20px] w-[226.09px] shrink-0 flex-col justify-center font-['FreeSans:Regular',sans-serif] not-italic">
            <p className="whitespace-pre-wrap leading-[20px]">
              ההצעה תקפה ל-14 ימים ממועד הפקתה.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Item13() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="flex size-full flex-row justify-end">
        <div className="relative flex w-full content-stretch items-start justify-end gap-[133.72px] pr-[20px] text-right text-[#475569] text-[14px] leading-[0]">
          <div className="relative flex h-[20px] w-[7px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal">
            <p className="whitespace-pre-wrap leading-[20px]"> </p>
          </div>
          <div className="relative flex h-[20px] w-[350.28px] shrink-0 flex-col justify-center font-['FreeSans:Regular',sans-serif] not-italic">
            <p className="whitespace-pre-wrap leading-[20px]">
              הזמנה סופית מותנית בחתימה על הסכם עבודה ותשלום מקדמה.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Item14() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="flex size-full flex-row justify-end">
        <div className="relative flex w-full content-stretch items-start justify-end gap-[189.53px] pr-[20px] text-right text-[#475569] text-[14px] leading-[0]">
          <div className="relative flex h-[20px] w-[7px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal">
            <p className="whitespace-pre-wrap leading-[20px]"> </p>
          </div>
          <div className="relative flex h-[20px] w-[294.47px] shrink-0 flex-col justify-center font-['FreeSans:Regular',sans-serif] not-italic">
            <p className="whitespace-pre-wrap leading-[20px]">
              ביטולים: עד 7 ימי עסקים לפני המועד - ללא דמי ביטול.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function List4() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-start gap-[8px] self-stretch"
      data-name="List"
    >
      <Item12 />
      <Item13 />
      <Item14 />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start justify-center gap-[32px] border-0 border-[transparent] border-solid bg-clip-padding">
        <List3 />
        <List4 />
      </div>
    </div>
  );
}

function SectionGeneralNotes() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[24px] bg-[rgba(255,140,0,0.05)]"
      data-name="Section - General Notes"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[24px] border border-[rgba(255,140,0,0.1)] border-solid"
      />
      <div className="relative flex w-full flex-col content-stretch items-start gap-[24px] px-[33px] pt-[49px] pb-[33px]">
        <Container45 />
        <Container47 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[82.31px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">{`סה"כ לתשלום`}</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[48px] w-[206.17px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] text-[#ff8c00] text-[48px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[48px]">₪42,500</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end pt-[4px]"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[172.7px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#94a3b8] text-[12px] uppercase not-italic leading-[0] tracking-[1.2px]">
        <p className="whitespace-pre-wrap leading-[16px]">{`* המחירים כוללים מע"מ כחוק`}</p>
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
      <Container52 />
      <Container53 />
    </div>
  );
}

function Container55() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[64.75px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">מחיר לאדם</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[36px] w-[78.34px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] text-[#0f172a] text-[30px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[36px]">₪850</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Container55 />
      <Container56 />
    </div>
  );
}

function Container49() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[64px]"
      data-name="Container"
    >
      <Container50 />
      <div
        className="h-[48px] w-px shrink-0 bg-[#e2e8f0]"
        data-name="Vertical Divider"
      />
      <Container54 />
    </div>
  );
}

function Heading11() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[32px] w-[168.61px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[24px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">סיכום הצעת מחיר</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[289.33px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular_Italic',sans-serif] text-[#64748b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          ההצעה מבוססת על קבוצה של 50 משתתפים
        </p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[8px]"
      data-name="Container"
    >
      <Heading11 />
      <Container58 />
    </div>
  );
}

function Container48() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-center justify-between border-0 border-[transparent] border-solid bg-clip-padding">
        <Container49 />
        <Container57 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[12px] bg-[#ff8c00] px-[48px] py-[12px]"
      data-name="Button"
    >
      <div
        className="absolute inset-0 rounded-[12px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(255,140,0,0.3),0px_4px_6px_-4px_rgba(255,140,0,0.3)]"
        data-name="Button:shadow"
      />
      <div className="relative flex h-[24px] w-[110.42px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[16px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">אשרו את ההצעה</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[12px] bg-[#f1f5f9] px-[32px] py-[12px]"
      data-name="Button"
    >
      <div className="relative flex h-[24px] w-[70.09px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">פנייה לנציג</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row justify-end">
        <div className="relative flex w-full content-stretch items-start justify-end gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding pr-[663.49px]">
          <Button />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function PricingSection() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[24px] bg-white"
      data-name="Pricing Section"
    >
      <div className="size-full overflow-clip rounded-[inherit]">
        <div className="relative flex w-full flex-col content-stretch items-start gap-[40px] px-[50px] pt-[66px] pb-[50px]">
          <div
            className="absolute top-[-30px] left-[-46px] size-[128px] rounded-br-[9999px] bg-[rgba(255,140,0,0.1)]"
            data-name="Overlay"
          />
          <Container48 />
          <Container59 />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[24px] border-2 border-[rgba(255,140,0,0.2)] border-solid shadow-[0px_25px_50px_-12px_rgba(255,140,0,0.1)]"
      />
    </div>
  );
}

function Main() {
  return (
    <div
      className="absolute top-[118px] right-[64px] left-[64px] flex max-w-[1152px] flex-col content-stretch items-start gap-[64px] px-[16px] py-[48px]"
      data-name="Main"
    >
      <SectionHeroIntro />
      <SectionItinerarySummary />
      <SectionDetailedComponents />
      <SectionGeneralNotes />
      <PricingSection />
    </div>
  );
}

function Link() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch"
      data-name="Link"
    >
      <div className="relative flex h-[20px] w-[60.53px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#94a3b8] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">יצירת קשר</p>
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
      <div className="relative flex h-[20px] w-[81.22px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#94a3b8] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">הפקות קודמות</p>
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
      <div className="relative flex h-[20px] w-[43.95px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#94a3b8] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">אודותינו</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-start gap-[32px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Link />
        <Link1 />
        <Link2 />
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[28px] w-[90.41px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[20px] text-white leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">Eventos</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div
      className="relative h-[13.313px] w-[13.656px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13.6562 13.3125"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.pa4e5800} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#ff8c00]"
      data-name="Background"
    >
      <Container64 />
    </div>
  );
}

function Container62() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container63 />
        <Background />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-center justify-between pb-[41px]"
      data-name="HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#1e293b] border-b border-solid"
      />
      <Container61 />
      <Container62 />
    </div>
  );
}

function Container68() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[123.94px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">
          office@travelpro.co.il
        </p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div
      className="relative h-[9.352px] w-[11.648px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6484 9.35156"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p2c74e180}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container67() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px]"
      data-name="Container"
    >
      <Container68 />
      <Container69 />
    </div>
  );
}

function Container71() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[78.23px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">03-123-4567</p>
      </div>
    </div>
  );
}

function Container72() {
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
            d={svgPaths.p29025e00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container70() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px]"
      data-name="Container"
    >
      <Container71 />
      <Container72 />
    </div>
  );
}

function Container66() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[24px]"
      data-name="Container"
    >
      <Container67 />
      <Container70 />
    </div>
  );
}

function Container73() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[260.88px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">
          © 2024 Eventos Production. כל הזכויות שמורות.
        </p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-center justify-between"
      data-name="Container"
    >
      <Container66 />
      <Container73 />
    </div>
  );
}

function Container60() {
  return (
    <div
      className="relative w-full max-w-[1152px] shrink-0"
      data-name="Container"
    >
      <div className="relative flex w-full max-w-[inherit] flex-col content-stretch items-start gap-[40px] px-[16px]">
        <HorizontalBorder />
        <Container65 />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div
      className="absolute top-[2743px] right-0 left-0 flex flex-col content-stretch items-start bg-[#0f172a] px-[64px] py-[48px]"
      data-name="Footer"
    >
      <Container60 />
    </div>
  );
}

function Container75() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[65.95px] shrink-0 flex-col justify-center text-center font-['FreeSans:Regular',sans-serif] text-[16px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">הורד PDF</p>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="relative size-[11.648px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6484 11.6484"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p3335cac0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[12px] bg-[#ff8c00] px-[20px] py-[10px]"
      data-name="Button"
    >
      <div
        className="absolute inset-[0_-0.35px_0_0] rounded-[12px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(255,140,0,0.2),0px_4px_6px_-4px_rgba(255,140,0,0.2)]"
        data-name="Button:shadow"
      />
      <Container75 />
      <Container76 />
    </div>
  );
}

function Heading() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 1"
    >
      <div className="relative flex h-[28px] w-[240.33px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#334155] text-[18px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">
          הצעת מחיר: נופש שנתי גליל עליון
        </p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[32px] w-[103.09px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#ff8c00] text-[24px] leading-[0] tracking-[-0.6px]">
        <p className="whitespace-pre-wrap leading-[32px]">Eventos</p>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div
      className="relative h-[19.969px] w-[20.484px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20.4844 19.9688"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p1463fae0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div
      className="relative flex size-[40px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#ff8c00]"
      data-name="Background"
    >
      <Container79 />
    </div>
  );
}

function Container77() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[12px]"
      data-name="Container"
    >
      <Container78 />
      <Background1 />
    </div>
  );
}

function Container74() {
  return (
    <div
      className="relative h-[80px] w-full max-w-[1152px] shrink-0"
      data-name="Container"
    >
      <div className="flex size-full max-w-[inherit] flex-row items-center">
        <div className="relative flex size-full max-w-[inherit] content-stretch items-center justify-between border-0 border-[transparent] border-solid bg-clip-padding px-[16px]">
          <Button2 />
          <Heading />
          <Container77 />
        </div>
      </div>
    </div>
  );
}

function HeaderSection() {
  return (
    <div
      className="absolute top-[37px] right-0 left-0 flex flex-col content-stretch items-start bg-[rgba(248,247,245,0.8)] px-[64px] pb-px backdrop-blur-[6px]"
      data-name="Header Section"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.1)] border-b border-solid"
      />
      <Container74 />
    </div>
  );
}

export default function Component() {
  return (
    <div
      className="relative size-full bg-[#f8f7f5]"
      data-name="דף הצעה ללקוח - עם תווית"
    >
      <BackgroundHorizontalBorder />
      <Main />
      <Footer />
      <HeaderSection />
    </div>
  );
}
