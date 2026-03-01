import svgPaths from "./svg-srow9czikn";
import img from "figma:asset/ad79f1607b35470b947bef516ed84cef936f0a03.png";
import imgWinery from "figma:asset/5ec9418d8feabf6e070a7f3335428b1fa8b3d0c2.png";
import imgDining from "figma:asset/36d363ebb10cc18a4f7f98f45bc555fc6d0f6935.png";
import imgTransport from "figma:asset/ded76283875a946982cffc8876b9d52b7966e6db.png";

function BackgroundHorizontalBorder() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch flex flex-col items-center left-0 pb-[9px] pt-[8px] right-0 top-0" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.2)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold','Arimo:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white tracking-[1.4px] uppercase w-[239.72px]">
        <p className="leading-[20px] whitespace-pre-wrap">SCREEN LABEL: דף הצעה ללקוח</p>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="גליל עליון">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[233.33%] left-0 max-w-none top-[-66.67%] w-full" src={img} />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[0_0_0.25px_0] items-start justify-center" data-name="Container">
      <Component1 />
      <div className="absolute bg-gradient-to-l from-[rgba(35,26,15,0.8)] inset-0 to-[rgba(35,26,15,0)] via-1/2 via-[rgba(35,26,15,0.4)]" data-name="Gradient" />
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(255,140,0,0.2)] content-stretch flex items-start justify-end px-[16px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-right w-[68.8px]">
        <p className="leading-[20px] whitespace-pre-wrap">יוצאים לדרך</p>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[96px] justify-center leading-[48px] not-italic relative shrink-0 text-[48px] text-right text-white w-[421.02px] whitespace-pre-wrap">
        <p className="mb-0">החוויה הגלילית שלכם</p>
        <p>מתחילה כאן</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-end pt-[8px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular_Italic',sans-serif] h-[88px] justify-center leading-[29.25px] not-italic relative shrink-0 text-[#f1f5f9] text-[18px] text-right w-[518.92px] whitespace-pre-wrap">
        <p className="mb-0">{`"בין הרים ירוקים, יקבי בוטיק וניחוחות של טבע פראי, הרכבנו עבורכם מסע`}</p>
        <p className="mb-0">שכולו התחדשות, גיבוש ופינוק בלתי מתפשר. הגליל העליון מחכה לכם עם</p>
        <p>{`שקט עוצמתי וחוויות קולינריות בלתי נשכחות."`}</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-end max-w-[672px] p-[64px] relative shrink-0" data-name="Container">
      <Overlay />
      <Heading1 />
      <Container2 />
    </div>
  );
}

function SectionHeroIntro() {
  return (
    <div className="relative rounded-[24px] shrink-0 w-full" data-name="Section - Hero & Intro">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center pb-[50.12px] pl-[448px] pt-[50.13px] relative w-full">
          <Container />
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[24px] text-right w-[105.97px]">
        <p className="leading-[32px] whitespace-pre-wrap">{`לו"ז מקוצר`}</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[992.03px] relative w-full">
          <Heading2 />
          <div className="bg-[#ff8c00] h-[32px] rounded-[9999px] shrink-0 w-[6px]" data-name="Background" />
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#ff8c00] text-[14px] text-right w-[91.02px]">
          <p className="leading-[20px] whitespace-pre-wrap">15:30 - 18:00</p>
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[18px] text-right w-[170px]">
          <p className="leading-[28px] whitespace-pre-wrap">{`סדנת גיבוש ומסע ג'יפים`}</p>
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] text-right w-[191.48px]">
          <p className="leading-[20px] whitespace-pre-wrap">אקשן ונופים מרהיבים בנחלי הגליל.</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-start p-[25px] relative rounded-[16px] self-stretch shrink-0 w-[357.34px]" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <Container5 />
      <Heading3 />
      <Container6 />
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#ff8c00] text-[14px] text-right w-[92.08px]">
          <p className="leading-[20px] whitespace-pre-wrap">13:00 - 15:00</p>
        </div>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[18px] text-right w-[129.58px]">
          <p className="leading-[28px] whitespace-pre-wrap">ארוחת צהריים שף</p>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] text-right w-[285.25px]">
          <p className="leading-[20px] whitespace-pre-wrap">{`חוויה קולינרית "מהחווה לשולחן" תחת כיפת השמיים.`}</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-start p-[25px] relative rounded-[16px] self-stretch shrink-0 w-[357.33px]" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <Container7 />
      <Heading4 />
      <Container8 />
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#ff8c00] text-[14px] text-right w-[95.98px]">
          <p className="leading-[20px] whitespace-pre-wrap">09:00 - 12:00</p>
        </div>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[18px] text-right w-[130.84px]">
          <p className="leading-[28px] whitespace-pre-wrap">סיור יקבים וטעימות</p>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] text-right w-[230.8px]">
          <p className="leading-[20px] whitespace-pre-wrap">פתיחת הבוקר בכרמים הירוקים של הגליל.</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-start p-[25px] relative rounded-[16px] self-stretch shrink-0 w-[357.33px]" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <Container9 />
      <Heading5 />
      <Container10 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
      <BackgroundBorderShadow2 />
    </div>
  );
}

function SectionItinerarySummary() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="Section - Itinerary Summary">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[24px] text-right w-[148.83px]">
        <p className="leading-[32px] whitespace-pre-wrap">פירוט הפעילויות</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[949.17px] relative w-full">
          <Heading6 />
          <div className="bg-[#ff8c00] h-[32px] rounded-[9999px] shrink-0 w-[6px]" data-name="Background" />
        </div>
      </div>
    </div>
  );
}

function Winery() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] w-full" data-name="Winery">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[16px]">
        <img alt="" className="absolute h-[106.25%] left-0 max-w-none top-[-3.13%] w-full" src={imgWinery} />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center relative shrink-0 w-[272px]" data-name="Container">
      <Winery />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[9px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 9 13.5">
        <g id="Container">
          <path d={svgPaths.p5da9840} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[692.66px] relative w-full">
          <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-right tracking-[0.7px] uppercase w-[97.34px]">
            <p className="leading-[20px] whitespace-pre-wrap">יקב רמות נפתלי</p>
          </div>
          <Container15 />
        </div>
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[33px] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[24px] text-right w-[332.27px]">
        <p className="leading-[33px] whitespace-pre-wrap">סיור כרמים, טעימות יין וגבינות בוטיק</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[52px] justify-center leading-[26px] not-italic relative shrink-0 text-[#475569] text-[16px] text-right w-[808.64px] whitespace-pre-wrap">
        <p className="mb-0">ניכנס אל לב תעשיית היין הגלילית. הסיור כולל מפגש מרתק עם היינן, הסברים על תהליך הייצור הייחודי לאזור הגליל העליון, וטעימה</p>
        <p>מודרכת של 5 סוגי יינות עטורי פרסים.</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[16px] text-right w-[327.47px]">
        <p className="leading-[24px] whitespace-pre-wrap">{`קבלת פנים עם יין רוזה צונן ופוקאצ'ות חמות מהטאבון.`}</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p3c62aa00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <Container18 />
    </div>
  );
}

function Item() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="content-stretch flex gap-[12px] items-start pl-[462.53px] relative w-full">
        <Container17 />
        <Margin />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[16px] text-right w-[296.22px]">
        <p className="leading-[24px] whitespace-pre-wrap">פלטת גבינות צאן מקומיות, אגוזים ופירות העונה.</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p3c62aa00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <Container20 />
    </div>
  );
}

function Item1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="content-stretch flex gap-[12px] items-start pl-[493.78px] relative w-full">
        <Container19 />
        <Margin1 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[16px] text-right w-[252.95px]">
        <p className="leading-[24px] whitespace-pre-wrap">סיור רגלי קל בכרמים המקיפים את היקב.</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p3c62aa00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <Container22 />
    </div>
  );
}

function Item2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="content-stretch flex gap-[12px] items-start pl-[537.05px] relative w-full">
        <Container21 />
        <Margin2 />
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="List">
      <Item />
      <Item1 />
      <Item2 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[816px]" data-name="Container">
      <Container14 />
      <Heading7 />
      <Container16 />
      <List />
    </div>
  );
}

function Activity() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full" data-name="Activity 1">
      <Container12 />
      <Container13 />
    </div>
  );
}

function Dining() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] w-full" data-name="Dining">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[16px]">
        <img alt="" className="absolute h-[106.25%] left-0 max-w-none top-[-3.13%] w-full" src={imgDining} />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[256px] relative shrink-0 w-[272px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <Dining />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[14.977px] relative shrink-0 w-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 14.9766">
        <g id="Container">
          <path d={svgPaths.p85e4600} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[695.7px] relative w-full">
          <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-right tracking-[0.7px] uppercase w-[94.3px]">
            <p className="leading-[20px] whitespace-pre-wrap">השף אייל גלילי</p>
          </div>
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[33px] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[24px] text-right w-[321.53px]">
        <p className="leading-[33px] whitespace-pre-wrap">{`ארוחת צהריים "גליל פראי" בטבע`}</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[52px] justify-center leading-[26px] not-italic relative shrink-0 text-[#475569] text-[16px] text-right w-[786.64px] whitespace-pre-wrap">
        <p className="mb-0">חוויה קולינרית המבוססת על ליקוט עונתי וחומרי גלם טריים ביותר. שולחן אבירים ארוך יחכה לכם תחת עצי אלון עתיקים, עם מנות</p>
        <p>שיוצאות היישר מהגריל והמעשנה.</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[16px] text-right w-[317.95px]">
        <p className="leading-[24px] whitespace-pre-wrap">תפריט בשרי עשיר (קיים מענה לצמחונים/טבעונים).</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p3c62aa00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <Container29 />
    </div>
  );
}

function Item3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="content-stretch flex gap-[12px] items-start pl-[472.05px] relative w-full">
        <Container28 />
        <Margin3 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[16px] text-right w-[265.75px]">
        <p className="leading-[24px] whitespace-pre-wrap">סלטים חיים עם שמן זית מבית הבד המקומי.</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p3c62aa00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <Container31 />
    </div>
  );
}

function Item4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="content-stretch flex gap-[12px] items-start pl-[524.25px] relative w-full">
        <Container30 />
        <Margin4 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[16px] text-right w-[228.22px]">
        <p className="leading-[24px] whitespace-pre-wrap">קינוחי שוקולד ופירות יער בסגנון ביתי.</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p3c62aa00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <Container33 />
    </div>
  );
}

function Item5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="content-stretch flex gap-[12px] items-start pl-[561.78px] relative w-full">
        <Container32 />
        <Margin5 />
      </div>
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="List">
      <Item3 />
      <Item4 />
      <Item5 />
    </div>
  );
}

function Container24() {
  return (
    <div className="relative shrink-0 w-[816px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative w-full">
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
    <div className="content-stretch flex gap-[32px] items-start pt-[49px] relative shrink-0 w-full" data-name="Activity 2">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <Container23 />
      <Container24 />
    </div>
  );
}

function Transport() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] w-full" data-name="Transport">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[16px]">
        <img alt="" className="absolute h-[106.25%] left-0 max-w-none top-[-3.13%] w-full" src={imgTransport} />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[256px] relative shrink-0 w-[272px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <Transport />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[14.238px] relative shrink-0 w-[12.023px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 12.0234 14.2383">
        <g id="Container">
          <path d={svgPaths.p4e0b480} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[7.99px] items-center pl-[645.88px] relative w-full">
          <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#ff8c00] text-[14px] text-right tracking-[0.7px] uppercase w-[144.13px]">
            <p className="leading-[20px] whitespace-pre-wrap">Royal Transport</p>
          </div>
          <Container37 />
        </div>
      </div>
    </div>
  );
}

function Heading9() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[33px] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[24px] text-right w-[281.69px]">
        <p className="leading-[33px] whitespace-pre-wrap">הסעות VIP ומעטפת לוגיסטית</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[52px] justify-center leading-[26px] not-italic relative shrink-0 text-[#475569] text-[16px] text-right w-[746.97px] whitespace-pre-wrap">
        <p className="mb-0">הדרך חשובה לא פחות מהיעד. אנחנו דואגים שתתחילו את החופשה ברגע שתעלו על האוטובוס, עם כל הנוחות והפינוקים</p>
        <p>האפשריים.</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[16px] text-right w-[368.84px]">
        <p className="leading-[24px] whitespace-pre-wrap">אוטובוס תיירים חדיש (מודל 2023) עם Wi-Fi ושקעי טעינה.</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p3c62aa00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <Container40 />
    </div>
  );
}

function Item6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="content-stretch flex gap-[12px] items-start pl-[421.16px] relative w-full">
        <Container39 />
        <Margin6 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[16px] text-right w-[335.75px]">
        <p className="leading-[24px] whitespace-pre-wrap">ערכת פינוק לכל נוסע הכוללת מים מינרליים ונשנושים.</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p3c62aa00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin7() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <Container42 />
    </div>
  );
}

function Item7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="content-stretch flex gap-[12px] items-start pl-[454.25px] relative w-full">
        <Container41 />
        <Margin7 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[16px] text-right w-[254.73px]">
        <p className="leading-[24px] whitespace-pre-wrap">נהג מקצועי המכיר כל עיקול ופינה בגליל.</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p3c62aa00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin8() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <Container44 />
    </div>
  );
}

function Item8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="content-stretch flex gap-[12px] items-start pl-[535.27px] relative w-full">
        <Container43 />
        <Margin8 />
      </div>
    </div>
  );
}

function List2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="List">
      <Item6 />
      <Item7 />
      <Item8 />
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 w-[816px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative w-full">
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
    <div className="content-stretch flex gap-[32px] items-start pt-[49px] relative shrink-0 w-full" data-name="Activity 3">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <Container34 />
      <Container35 />
    </div>
  );
}

function SectionDetailedComponents() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full" data-name="Section - Detailed Components">
      <Container11 />
      <Activity />
      <Activity1 />
      <Activity2 />
    </div>
  );
}

function Heading10() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[20px] text-right w-[97.05px]">
        <p className="leading-[28px] whitespace-pre-wrap">חשוב לדעת</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 size-[19.969px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9688 19.9688">
        <g id="Container">
          <path d={svgPaths.p14f29100} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pl-[920.95px] relative w-full">
          <Heading10 />
          <Container46 />
        </div>
      </div>
    </div>
  );
}

function Item9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex gap-[237.33px] items-start justify-end leading-[0] pr-[20px] relative text-[#475569] text-[14px] text-right w-full">
          <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 w-[7px]">
            <p className="leading-[20px] whitespace-pre-wrap">{` `}</p>
          </div>
          <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center not-italic relative shrink-0 w-[246.67px]">
            <p className="leading-[20px] whitespace-pre-wrap">המחיר כולל ביטוח אתגרי לכלל המשתתפים.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Item10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex gap-[125.72px] items-start justify-end leading-[0] pr-[20px] relative text-[#475569] text-[14px] text-right w-full">
          <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 w-[7px]">
            <p className="leading-[20px] whitespace-pre-wrap">{` `}</p>
          </div>
          <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center not-italic relative shrink-0 w-[358.28px]">
            <p className="leading-[20px] whitespace-pre-wrap">{`יש להצטייד בנעלי הליכה נוחות ובגדים להחלפה למסלול הג'יפים.`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Item11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex gap-[199.05px] items-start justify-end leading-[0] pr-[20px] relative text-[#475569] text-[14px] text-right w-full">
          <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 w-[7px]">
            <p className="leading-[20px] whitespace-pre-wrap">{` `}</p>
          </div>
          <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center not-italic relative shrink-0 w-[284.95px]">
            <p className="leading-[20px] whitespace-pre-wrap">לוחות הזמנים ניתנים לשינוי בהתאם לבקשת הלקוח.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function List3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative self-stretch" data-name="List">
      <Item9 />
      <Item10 />
      <Item11 />
    </div>
  );
}

function Item12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex gap-[257.91px] items-start justify-end leading-[0] pr-[20px] relative text-[#475569] text-[14px] text-right w-full">
          <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 w-[7px]">
            <p className="leading-[20px] whitespace-pre-wrap">{` `}</p>
          </div>
          <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center not-italic relative shrink-0 w-[226.09px]">
            <p className="leading-[20px] whitespace-pre-wrap">ההצעה תקפה ל-14 ימים ממועד הפקתה.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Item13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex gap-[133.72px] items-start justify-end leading-[0] pr-[20px] relative text-[#475569] text-[14px] text-right w-full">
          <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 w-[7px]">
            <p className="leading-[20px] whitespace-pre-wrap">{` `}</p>
          </div>
          <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center not-italic relative shrink-0 w-[350.28px]">
            <p className="leading-[20px] whitespace-pre-wrap">הזמנה סופית מותנית בחתימה על הסכם עבודה ותשלום מקדמה.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Item14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex gap-[189.53px] items-start justify-end leading-[0] pr-[20px] relative text-[#475569] text-[14px] text-right w-full">
          <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 w-[7px]">
            <p className="leading-[20px] whitespace-pre-wrap">{` `}</p>
          </div>
          <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center not-italic relative shrink-0 w-[294.47px]">
            <p className="leading-[20px] whitespace-pre-wrap">ביטולים: עד 7 ימי עסקים לפני המועד - ללא דמי ביטול.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function List4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative self-stretch" data-name="List">
      <Item12 />
      <Item13 />
      <Item14 />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[32px] items-start justify-center relative w-full">
        <List3 />
        <List4 />
      </div>
    </div>
  );
}

function SectionGeneralNotes() {
  return (
    <div className="bg-[rgba(255,140,0,0.05)] relative rounded-[24px] shrink-0 w-full" data-name="Section - General Notes">
      <div aria-hidden="true" className="absolute border border-[rgba(255,140,0,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[33px] pt-[49px] px-[33px] relative w-full">
        <Container45 />
        <Container47 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] text-right w-[82.31px]">
        <p className="leading-[20px] whitespace-pre-wrap">{`סה"כ לתשלום`}</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] h-[48px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[48px] text-right w-[206.17px]">
        <p className="leading-[48px] whitespace-pre-wrap">₪42,500</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-end pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] text-right tracking-[1.2px] uppercase w-[172.7px]">
        <p className="leading-[16px] whitespace-pre-wrap">{`* המחירים כוללים מע"מ כחוק`}</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Container51 />
      <Container52 />
      <Container53 />
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] text-right w-[64.75px]">
        <p className="leading-[20px] whitespace-pre-wrap">מחיר לאדם</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] h-[36px] justify-center leading-[0] not-italic relative shrink-0 text-[#0f172a] text-[30px] text-right w-[78.34px]">
        <p className="leading-[36px] whitespace-pre-wrap">₪850</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Container55 />
      <Container56 />
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex gap-[64px] items-center relative shrink-0" data-name="Container">
      <Container50 />
      <div className="bg-[#e2e8f0] h-[48px] shrink-0 w-px" data-name="Vertical Divider" />
      <Container54 />
    </div>
  );
}

function Heading11() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[24px] text-right w-[168.61px]">
        <p className="leading-[32px] whitespace-pre-wrap">סיכום הצעת מחיר</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular_Italic',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[16px] text-right w-[289.33px]">
        <p className="leading-[24px] whitespace-pre-wrap">ההצעה מבוססת על קבוצה של 50 משתתפים</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Container">
      <Heading11 />
      <Container58 />
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative w-full">
        <Container49 />
        <Container57 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex flex-col items-center justify-center px-[48px] py-[12px] relative rounded-[12px] shrink-0" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(255,140,0,0.3),0px_4px_6px_-4px_rgba(255,140,0,0.3)]" data-name="Button:shadow" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[110.42px]">
        <p className="leading-[24px] whitespace-pre-wrap">אשרו את ההצעה</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex flex-col items-center justify-center px-[32px] py-[12px] relative rounded-[12px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[16px] text-center w-[70.09px]">
        <p className="leading-[24px] whitespace-pre-wrap">פנייה לנציג</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-end size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start justify-end pr-[663.49px] relative w-full">
          <Button />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function PricingSection() {
  return (
    <div className="bg-white relative rounded-[24px] shrink-0 w-full" data-name="Pricing Section">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[40px] items-start pb-[50px] pt-[66px] px-[50px] relative w-full">
          <div className="absolute bg-[rgba(255,140,0,0.1)] left-[-46px] rounded-br-[9999px] size-[128px] top-[-30px]" data-name="Overlay" />
          <Container48 />
          <Container59 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,140,0,0.2)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_25px_50px_-12px_rgba(255,140,0,0.1)]" />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[64px] items-start left-[64px] max-w-[1152px] px-[16px] py-[48px] right-[64px] top-[118px]" data-name="Main">
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
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] text-right w-[60.53px]">
        <p className="leading-[20px] whitespace-pre-wrap">יצירת קשר</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] text-right w-[81.22px]">
        <p className="leading-[20px] whitespace-pre-wrap">הפקות קודמות</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] text-right w-[43.95px]">
        <p className="leading-[20px] whitespace-pre-wrap">אודותינו</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[32px] items-start relative">
        <Link />
        <Link1 />
        <Link2 />
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[20px] text-right text-white w-[90.41px]">
        <p className="leading-[28px] whitespace-pre-wrap">TravelPro</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="h-[13.313px] relative shrink-0 w-[13.656px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 13.6562 13.3125">
        <g id="Container">
          <path d={svgPaths.pa4e5800} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Background">
      <Container64 />
    </div>
  );
}

function Container62() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
        <Container63 />
        <Background />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="content-stretch flex items-center justify-between pb-[41px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#1e293b] border-b border-solid inset-0 pointer-events-none" />
      <Container61 />
      <Container62 />
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[123.94px]">
        <p className="leading-[16px] whitespace-pre-wrap">office@travelpro.co.il</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[9.352px] relative shrink-0 w-[11.648px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 9.35156">
        <g id="Container">
          <path d={svgPaths.p2c74e180} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Container68 />
      <Container69 />
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[78.23px]">
        <p className="leading-[16px] whitespace-pre-wrap">03-123-4567</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p29025e00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Container71 />
      <Container72 />
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Container">
      <Container67 />
      <Container70 />
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[260.88px]">
        <p className="leading-[16px] whitespace-pre-wrap">© 2024 TravelPro Production. כל הזכויות שמורות.</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container66 />
      <Container73 />
    </div>
  );
}

function Container60() {
  return (
    <div className="max-w-[1152px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[40px] items-start max-w-[inherit] px-[16px] relative w-full">
        <HorizontalBorder />
        <Container65 />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch flex flex-col items-start left-0 px-[64px] py-[48px] right-0 top-[2743px]" data-name="Footer">
      <Container60 />
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[65.95px]">
        <p className="leading-[24px] whitespace-pre-wrap">הורד PDF</p>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="relative shrink-0 size-[11.648px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6484 11.6484">
        <g id="Container">
          <path d={svgPaths.p3335cac0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex gap-[8px] items-center px-[20px] py-[10px] relative rounded-[12px] shrink-0" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.35px_0_0] rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(255,140,0,0.2),0px_4px_6px_-4px_rgba(255,140,0,0.2)]" data-name="Button:shadow" />
      <Container75 />
      <Container76 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 1">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[18px] text-right w-[240.33px]">
        <p className="leading-[28px] whitespace-pre-wrap">הצעת מחיר: נופש שנתי גליל עליון</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[#ff8c00] text-[24px] text-right tracking-[-0.6px] w-[103.09px]">
        <p className="leading-[32px] whitespace-pre-wrap">TravelPro</p>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="h-[19.969px] relative shrink-0 w-[20.484px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20.4844 19.9688">
        <g id="Container">
          <path d={svgPaths.p1463fae0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="Background">
      <Container79 />
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Container78 />
      <Background1 />
    </div>
  );
}

function Container74() {
  return (
    <div className="h-[80px] max-w-[1152px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center max-w-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between max-w-[inherit] px-[16px] relative size-full">
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
    <div className="absolute backdrop-blur-[6px] bg-[rgba(248,247,245,0.8)] content-stretch flex flex-col items-start left-0 pb-px px-[64px] right-0 top-[37px]" data-name="Header Section">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Container74 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#f8f7f5] relative size-full" data-name="דף הצעה ללקוח - עם תווית">
      <BackgroundHorizontalBorder />
      <Main />
      <Footer />
      <HeaderSection />
    </div>
  );
}