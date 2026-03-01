import svgPaths from "./svg-ntx5q0ywbb";
import img from "figma:asset/14fc5c10607c74f819ffed8c4bc5391b85bb57cd.png";
import img1 from "figma:asset/6633085593e2d108ed4d9af054dfddf4d4660821.png";
import img2 from "figma:asset/313e431932428c1fcdf0a59b0653409317c65671.png";

function Component1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="נוף כנרת וגולן">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[130%] left-0 max-w-none top-[-15%] w-full" src={img} />
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="absolute bg-[#ff8c00] content-stretch flex items-start justify-end left-[116.95px] px-[12px] py-[4px] rounded-[9999px] top-0" data-name="Background">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[12px] text-right text-white w-[102.92px]">
        <p className="leading-[16px] whitespace-pre-wrap">הצעה בתוקף ל-7 ימים</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-0 right-0 top-[31px]" data-name="Heading 1">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[38px] justify-center leading-[0] relative shrink-0 text-[30px] text-right text-white w-[243.88px]">
        <p className="leading-[37.5px] whitespace-pre-wrap">יום גיבוש: קסם בצפון</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-0 right-0 top-[69.5px]" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[28px] justify-center leading-[0] relative shrink-0 text-[#e2e8f0] text-[18px] text-right w-[203.03px]">
        <p className="leading-[28px] whitespace-pre-wrap">{`עבור: חברת "טק-פיוצ'ר" בע"מ`}</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bottom-[24px] h-[97.5px] right-[23.99px] w-[243.88px]" data-name="Container">
      <Background />
      <Heading />
      <Container1 />
    </div>
  );
}

function HeroBanner() {
  return (
    <div className="absolute content-stretch flex flex-col h-[300px] items-start justify-center left-0 overflow-clip right-0 top-[102px]" data-name="Hero Banner">
      <Component1 />
      <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.8)] inset-0 to-[rgba(0,0,0,0)] via-1/2 via-[rgba(0,0,0,0.2)]" data-name="Gradient" />
      <Container />
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[205.91px] relative w-full">
          <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[20px] text-right w-[138.09px]">
            <p className="leading-[28px] whitespace-pre-wrap">לו״ז היום המתוכנן</p>
          </div>
          <div className="bg-[#ff8c00] h-[24px] rounded-[9999px] shrink-0 w-[6px]" data-name="Background" />
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[18px] text-right w-[156.17px]">
        <p className="leading-[28px] whitespace-pre-wrap">התכנסות וארוחת בוקר</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-end pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#475569] text-[14px] text-right w-[257.69px]">
        <p className="leading-[20px] whitespace-pre-wrap">קבלת פנים בקיבוץ גנוסר, קפה ומאפים מול הכנרת.</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#ff8c00] text-[14px] text-right w-[77px]">
        <p className="leading-[20px] whitespace-pre-wrap">08:30 - 09:30</p>
      </div>
      <Heading2 />
      <Container3 />
    </div>
  );
}

function TimelineItem() {
  return (
    <div className="relative shrink-0 w-full" data-name="Timeline Item 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <Container2 />
        <div className="absolute bg-[#ff8c00] right-[-43px] rounded-[9999px] size-[24px] top-0" data-name="Background+Border">
          <div aria-hidden="true" className="absolute border-4 border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[18px] text-right w-[126.53px]">
        <p className="leading-[28px] whitespace-pre-wrap">{`מסע ג'יפים אתגרי`}</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-end pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#475569] text-[14px] text-right w-[227.3px]">
        <p className="leading-[20px] whitespace-pre-wrap">נהיגה עצמית וסיור מודרך במעלה רמת הגולן.</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[14px] text-right w-[75.72px]">
        <p className="leading-[20px] whitespace-pre-wrap">10:00 - 13:00</p>
      </div>
      <Heading3 />
      <Container5 />
    </div>
  );
}

function TimelineItem1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Timeline Item 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <Container4 />
        <div className="absolute bg-[rgba(255,140,0,0.3)] right-[-43px] rounded-[9999px] size-[24px] top-0" data-name="Overlay+Border">
          <div aria-hidden="true" className="absolute border-4 border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
        </div>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[18px] text-right w-[146.36px]">
        <p className="leading-[28px] whitespace-pre-wrap">ארוחת צהריים בשטח</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-end pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#475569] text-[14px] text-right w-[176.72px]">
        <p className="leading-[20px] whitespace-pre-wrap">גריל בוקרים מפנק בלב מטע זיתים.</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[14px] text-right w-[75.72px]">
        <p className="leading-[20px] whitespace-pre-wrap">13:30 - 15:00</p>
      </div>
      <Heading4 />
      <Container7 />
    </div>
  );
}

function TimelineItem2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Timeline Item 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <Container6 />
        <div className="absolute bg-[rgba(255,140,0,0.3)] right-[-43px] rounded-[9999px] size-[24px] top-0" data-name="Overlay+Border">
          <div aria-hidden="true" className="absolute border-4 border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
        </div>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[18px] text-right w-[118.77px]">
        <p className="leading-[28px] whitespace-pre-wrap">סיכום וטעימות יין</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-end pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#475569] text-[14px] text-right w-[263.56px]">
        <p className="leading-[20px] whitespace-pre-wrap">ביקור ביקב בוטיק וחלוקת מזכרות מצוות TravelPro.</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[14px] text-right w-[75.72px]">
        <p className="leading-[20px] whitespace-pre-wrap">15:30 - 17:00</p>
      </div>
      <Heading5 />
      <Container9 />
    </div>
  );
}

function TimelineItem3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Timeline Item 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <Container8 />
        <div className="absolute bg-[rgba(255,140,0,0.3)] right-[-43px] rounded-[9999px] size-[24px] top-0" data-name="Overlay+Border">
          <div aria-hidden="true" className="absolute border-4 border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
        </div>
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start pr-[34px] relative shrink-0 w-[346px]" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.2)] border-r-2 border-solid inset-0 pointer-events-none" />
      <TimelineItem />
      <TimelineItem1 />
      <TimelineItem2 />
      <TimelineItem3 />
    </div>
  );
}

function TimelineInteractiveSection() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 px-[16px] right-0 top-[544px]" data-name="Timeline Interactive Section">
      <Heading1 />
      <VerticalBorder />
    </div>
  );
}

function Heading6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[7.99px] items-center pl-[230.88px] relative w-full">
          <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[20px] text-right w-[113.13px]">
            <p className="leading-[28px] whitespace-pre-wrap">פירוט פעילויות</p>
          </div>
          <div className="bg-[#ff8c00] h-[24px] rounded-[9999px] shrink-0 w-[6px]" data-name="Background" />
        </div>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="טיול ג\'יפים">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[185.42%] left-0 max-w-none top-[-42.71%] w-full" src={img1} />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[192px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <Component2 />
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[15.667px] z-[1]" data-name="Margin">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 15.6667 11.6667">
        <g id="Margin">
          <path d={svgPaths.p29478120} fill="var(--fill-0, #0F172A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex isolate items-center justify-between px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[12px] text-right w-[32.19px] z-[2]">
        <p className="leading-[16px] whitespace-pre-wrap">3 שעות</p>
      </div>
      <Margin />
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[20px] text-right w-[140.59px]">
        <p className="leading-[28px] whitespace-pre-wrap">{`מסע ג'יפים אתגרי`}</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Background1 />
      <Heading7 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[78px] justify-center leading-[26px] relative shrink-0 text-[#475569] text-[16px] text-right w-[312.8px] whitespace-pre-wrap">
        <p className="mb-0">{`נצא למסע מרתק בין נחלים ותצפיות מרהיבות. הג'יפים`}</p>
        <p className="mb-0">הם בנהיגה עצמית (לבעלי רישיון) בליווי מדריכים</p>
        <p>מקצועיים של TravelPro. כולל עצירה לקפה בטבע.</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(255,140,0,0.1)] content-stretch flex flex-col items-end px-[8px] py-[4px] relative rounded-[4px] self-stretch shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#ff8c00] text-[10px] text-right tracking-[0.5px] uppercase w-[46.55px]">
        <p className="leading-[15px] whitespace-pre-wrap">ביטוח מלא</p>
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(255,140,0,0.1)] content-stretch flex flex-col items-end px-[8px] py-[4px] relative rounded-[4px] self-stretch shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#ff8c00] text-[10px] text-right tracking-[0.5px] uppercase w-[51.02px]">
        <p className="leading-[15px] whitespace-pre-wrap">כולל הדרכה</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[7.99px] items-start pl-[178.44px] pt-[8px] relative w-full">
        <Overlay />
        <Overlay1 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start p-[20px] relative w-full">
        <Container12 />
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function Activity() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Activity 1">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <Container10 />
        <Container11 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Component3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="ארוחת צהריים">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[185.42%] left-0 max-w-none top-[-42.71%] w-full" src={img2} />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[192px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <Component3 />
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[12.75px] z-[1]" data-name="Margin">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 12.75 11.6667">
        <g id="Margin">
          <path d={svgPaths.p16697200} fill="var(--fill-0, #0F172A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex isolate items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[12px] text-right w-[58.27px] z-[2]">
        <p className="leading-[16px] whitespace-pre-wrap">כשר למהדרין</p>
      </div>
      <Margin1 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[20px] text-right w-[163.11px]">
        <p className="leading-[28px] whitespace-pre-wrap">סעודת בוקרים בשטח</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Background2 />
      <Heading8 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[78px] justify-center leading-[26px] relative shrink-0 text-[#475569] text-[16px] text-right w-[287.28px] whitespace-pre-wrap">
        <p className="mb-0">ארוחת צהריים עשירה הכוללת נתחי בשר מובחרים</p>
        <p className="mb-0">מהגולן, סלטים טריים, תוספות חמות ושתייה קלה</p>
        <p>חופשית. הארוחה מוגשת תחת הצללה מעוצבת.</p>
      </div>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(255,140,0,0.1)] content-stretch flex flex-col items-end px-[8px] py-[4px] relative rounded-[4px] self-stretch shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#ff8c00] text-[10px] text-right tracking-[0.5px] uppercase w-[69.69px]">
        <p className="leading-[15px] whitespace-pre-wrap">אופציה טבעונית</p>
      </div>
    </div>
  );
}

function Overlay3() {
  return (
    <div className="bg-[rgba(255,140,0,0.1)] content-stretch flex flex-col items-end px-[8px] py-[4px] relative rounded-[4px] self-stretch shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#ff8c00] text-[10px] text-right tracking-[0.5px] uppercase w-[50.59px]">
        <p className="leading-[15px] whitespace-pre-wrap">פריסת שטח</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start pl-[155.72px] pt-[8px] relative w-full">
        <Overlay2 />
        <Overlay3 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start p-[20px] relative w-full">
        <Container17 />
        <Container18 />
        <Container19 />
      </div>
    </div>
  );
}

function Activity1() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Activity 2">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <Container15 />
        <Container16 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function SectionActivityCardsVerticalList() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 px-[16px] right-0 top-[1028px]" data-name="Section - Activity Cards (Vertical List)">
      <Heading6 />
      <Activity />
      <Activity1 />
    </div>
  );
}

function Heading9() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[20px] text-right text-white w-[136.47px]">
        <p className="leading-[28px] whitespace-pre-wrap">מה כלול בחבילה?</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#cbd5e1] text-[16px] text-right w-[242.72px]">
        <p className="leading-[24px] whitespace-pre-wrap">אוטובוס תיירים צמוד (מאיסוף ועד החזרה)</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p1caa9380} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Item() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.99px] items-center pl-[63.27px] relative w-full">
          <Container20 />
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#cbd5e1] text-[16px] text-right w-[219.39px]">
        <p className="leading-[24px] whitespace-pre-wrap">ליווי של 2 מדריכי TravelPro מוסמכים</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p1caa9380} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Item1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[86.59px] relative w-full">
          <Container22 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#cbd5e1] text-[16px] text-right w-[236.78px]">
        <p className="leading-[24px] whitespace-pre-wrap">כל הכניסות לאתרים והפעילויות המצוינות</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p1caa9380} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Item2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[69.2px] relative w-full">
          <Container24 />
          <Container25 />
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#cbd5e1] text-[16px] text-right w-[283.55px]">
        <p className="leading-[24px] whitespace-pre-wrap">ערכת עזרה ראשונה ומים מינרליים לאורך כל היום</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p1caa9380} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Item3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.99px] items-center pl-[22.44px] relative w-full">
          <Container26 />
          <Container27 />
        </div>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start pb-[8px] relative shrink-0 w-full" data-name="List">
      <Item />
      <Item1 />
      <Item2 />
      <Item3 />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[12px] text-center w-[286.53px]">
          <p className="leading-[16px] whitespace-pre-wrap">{`המחיר אינו כולל מע"מ כחוק. כפוף לתנאי הביטול המופיעים באתר.`}</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[25px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#1e293b] border-solid border-t inset-0 pointer-events-none" />
      <Container28 />
    </div>
  );
}

function IncludedSection() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch flex flex-col gap-[24px] items-start left-0 px-[24px] py-[32px] right-0 rounded-tl-[24px] rounded-tr-[24px] top-[1926px]" data-name="Included Section">
      <Heading9 />
      <List />
      <HorizontalBorder />
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-[16px] right-[16px] top-[44px]" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[12px] text-right w-[19.41px]">
        <p className="leading-[16px] whitespace-pre-wrap">אזור</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-[16px] right-[16px] top-[60px]" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[63.66px]">
        <p className="leading-[24px] whitespace-pre-wrap">רמת הגולן</p>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="absolute bg-white border border-[#f1f5f9] border-solid inset-[16px_288px_16px_-18px] rounded-[12px]" data-name="Background+Border">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[-1px] rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Overlay+Shadow" />
      <div className="absolute h-[20px] left-[81.98px] top-[18px] w-[16px]" data-name="Icon">
        <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
          <path d={svgPaths.p1869180} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </svg>
      </div>
      <Container29 />
      <Container30 />
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-[16px] right-[16px] top-[44px]" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[12px] text-right w-[45.48px]">
        <p className="leading-[16px] whitespace-pre-wrap">משתתפים</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-[16px] right-[16px] top-[60px]" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[44.83px]">
        <p className="leading-[24px] whitespace-pre-wrap">45 איש</p>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="absolute bg-white border border-[#f1f5f9] border-solid inset-[16px_152px_16px_118px] rounded-[12px]" data-name="Background+Border">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[-1px] rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Overlay+Shadow" />
      <div className="absolute h-[16px] left-[78.98px] top-[20px] w-[22px]" data-name="Icon">
        <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 22 16">
          <path d={svgPaths.p39955c80} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </svg>
      </div>
      <Container31 />
      <Container32 />
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-[16px] right-[16px] top-[44px]" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[12px] text-right w-[46.25px]">
        <p className="leading-[16px] whitespace-pre-wrap">תאריך יעד</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-[16px] right-[16px] top-[60px]" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[16px] text-right w-[74.86px]">
        <p className="leading-[24px] whitespace-pre-wrap">15.10.2024</p>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="absolute bg-white border border-[#f1f5f9] border-solid inset-[16px_16px_16px_254px] rounded-[12px]" data-name="Background+Border">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[-1px] rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Overlay+Shadow" />
      <div className="absolute h-[20px] left-[80.98px] top-[18px] w-[18px]" data-name="Icon">
        <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
          <path d={svgPaths.p2a946800} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </svg>
      </div>
      <Container33 />
      <Container34 />
    </div>
  );
}

function SummaryStats() {
  return (
    <div className="absolute h-[134px] left-0 overflow-clip right-0 top-[378px]" data-name="Summary Stats">
      <BackgroundBorder />
      <BackgroundBorder1 />
      <BackgroundBorder2 />
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[20px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
        <g id="Container">
          <path d={svgPaths.p2b729200} fill="var(--fill-0, #0F172A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[9999px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center p-[8px] relative">
        <Container35 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[20px] text-right tracking-[-0.5px] w-[79.98px]">
        <p className="whitespace-pre-wrap">
          <span className="leading-[28px]">Travel</span>
          <span className="font-['Assistant:Bold',sans-serif] font-bold leading-[28px] text-[#ff8c00]">Pro</span>
        </p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[25px] relative shrink-0 w-[25.625px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 25.625 25">
        <g id="Container">
          <path d={svgPaths.p37c3ec80} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
        <Container37 />
        <Container38 />
      </div>
    </div>
  );
}

function HeaderNavbar() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(255,255,255,0.8)] content-stretch flex items-center justify-between left-0 pb-[13px] pt-[12px] px-[16px] right-0 top-[37px]" data-name="Header / Navbar">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <Button />
      <Container36 />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[16px] relative shrink-0 w-[19px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 19 16">
        <g id="Container">
          <path d={svgPaths.pb36e280} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#ff8c00] flex-[1_0_0] min-h-px min-w-px relative rounded-[12px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center px-[32px] py-[12px] relative w-full">
          <Container39 />
          <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white w-[67.75px]">
            <p className="leading-[24px] whitespace-pre-wrap">אשר הצעה</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[12px] text-right w-[61.77px]">
        <p className="leading-[16px] whitespace-pre-wrap">סה״כ לתשלום</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-0 top-[13px]" data-name="Container">
      <div className="flex flex-col font-['Assistant:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[77.7px]">
        <p className="leading-[16px] whitespace-pre-wrap">(₪330 למשתתף)</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-[81.71px] top-0" data-name="Container">
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[24px] text-right w-[88.81px]">
        <p className="leading-[32px] whitespace-pre-wrap">₪14,850</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <Container43 />
      <Container44 />
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <Container41 />
        <Container42 />
      </div>
    </div>
  );
}

function StickyFooter() {
  return (
    <div className="absolute bg-white bottom-0 content-stretch flex items-center justify-between left-0 pb-[32px] pt-[17px] px-[16px] right-0" data-name="Sticky Footer">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.1)]" />
      <Button1 />
      <Container40 />
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch flex flex-col items-center left-0 pb-[9px] pt-[8px] px-[16px] right-0 top-0" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#334155] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Assistant:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white tracking-[0.35px] uppercase w-[224.03px]">
        <p className="leading-[20px] whitespace-pre-wrap">SCREEN LABEL: הצעה ללקוח (מובייל)</p>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#f8f7f5] relative size-full" data-name="הצעה ללקוח מובייל - עם תווית">
      <HeroBanner />
      <TimelineInteractiveSection />
      <SectionActivityCardsVerticalList />
      <IncludedSection />
      <SummaryStats />
      <HeaderNavbar />
      <StickyFooter />
      <BackgroundHorizontalBorder />
    </div>
  );
}