import img from "figma:asset/14fc5c10607c74f819ffed8c4bc5391b85bb57cd.png";
import img2 from "figma:asset/313e431932428c1fcdf0a59b0653409317c65671.png";
import img1 from "figma:asset/6633085593e2d108ed4d9af054dfddf4d4660821.png";
import svgPaths from "./svg-ntx5q0ywbb";

function Component1() {
  return (
    <div
      className="relative min-h-px w-full min-w-px flex-[1_0_0]"
      data-name="נוף כנרת וגולן"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute top-[-15%] left-0 h-[130%] w-full max-w-none"
          height="600"
          src={img}
          width="800"
        />
      </div>
    </div>
  );
}

function Background() {
  return (
    <div
      className="absolute top-0 left-[116.95px] flex content-stretch items-start justify-end rounded-[9999px] bg-[#ff8c00] px-[12px] py-[4px]"
      data-name="Background"
    >
      <div className="relative flex h-[16px] w-[102.92px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[12px] text-white leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">
          הצעה בתוקף ל-7 ימים
        </p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div
      className="absolute top-[31px] right-0 left-0 flex flex-col content-stretch items-end"
      data-name="Heading 1"
    >
      <div className="relative flex h-[38px] w-[243.88px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[30px] text-white leading-[0]">
        <p className="whitespace-pre-wrap leading-[37.5px]">
          יום גיבוש: קסם בצפון
        </p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div
      className="absolute top-[69.5px] right-0 left-0 flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[28px] w-[203.03px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#e2e8f0] text-[18px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">{`עבור: חברת "טק-פיוצ'ר" בע"מ`}</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div
      className="absolute right-[23.99px] bottom-[24px] h-[97.5px] w-[243.88px]"
      data-name="Container"
    >
      <Background />
      <Heading />
      <Container1 />
    </div>
  );
}

function HeroBanner() {
  return (
    <div
      className="absolute top-[102px] right-0 left-0 flex h-[300px] flex-col content-stretch items-start justify-center overflow-clip"
      data-name="Hero Banner"
    >
      <Component1 />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] via-1/2 via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0)]"
        data-name="Gradient"
      />
      <Container />
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 2">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[8px] pl-[205.91px]">
          <div className="relative flex h-[28px] w-[138.09px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[20px] leading-[0]">
            <p className="whitespace-pre-wrap leading-[28px]">
              לו״ז היום המתוכנן
            </p>
          </div>
          <div
            className="h-[24px] w-[6px] shrink-0 rounded-[9999px] bg-[#ff8c00]"
            data-name="Background"
          />
        </div>
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
      <div className="relative flex h-[28px] w-[156.17px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[18px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">
          התכנסות וארוחת בוקר
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end pt-[4px]"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[257.69px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          קבלת פנים בקיבוץ גנוסר, קפה ומאפים מול הכנרת.
        </p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[77px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#ff8c00] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">08:30 - 09:30</p>
      </div>
      <Heading2 />
      <Container3 />
    </div>
  );
}

function TimelineItem() {
  return (
    <div className="relative w-full shrink-0" data-name="Timeline Item 1">
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding">
        <Container2 />
        <div
          className="absolute top-0 right-[-43px] size-[24px] rounded-[9999px] bg-[#ff8c00]"
          data-name="Background+Border"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[9999px] border-4 border-white border-solid"
          />
        </div>
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
      <div className="relative flex h-[28px] w-[126.53px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[18px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">{`מסע ג'יפים אתגרי`}</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end pt-[4px]"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[227.3px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          נהיגה עצמית וסיור מודרך במעלה רמת הגולן.
        </p>
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
      <div className="relative flex h-[20px] w-[75.72px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#64748b] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">10:00 - 13:00</p>
      </div>
      <Heading3 />
      <Container5 />
    </div>
  );
}

function TimelineItem1() {
  return (
    <div className="relative w-full shrink-0" data-name="Timeline Item 2">
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding">
        <Container4 />
        <div
          className="absolute top-0 right-[-43px] size-[24px] rounded-[9999px] bg-[rgba(255,140,0,0.3)]"
          data-name="Overlay+Border"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[9999px] border-4 border-white border-solid"
          />
        </div>
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
      <div className="relative flex h-[28px] w-[146.36px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[18px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">ארוחת צהריים בשטח</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end pt-[4px]"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[176.72px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          גריל בוקרים מפנק בלב מטע זיתים.
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
      <div className="relative flex h-[20px] w-[75.72px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#64748b] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">13:30 - 15:00</p>
      </div>
      <Heading4 />
      <Container7 />
    </div>
  );
}

function TimelineItem2() {
  return (
    <div className="relative w-full shrink-0" data-name="Timeline Item 3">
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding">
        <Container6 />
        <div
          className="absolute top-0 right-[-43px] size-[24px] rounded-[9999px] bg-[rgba(255,140,0,0.3)]"
          data-name="Overlay+Border"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[9999px] border-4 border-white border-solid"
          />
        </div>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[28px] w-[118.77px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[18px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">סיכום וטעימות יין</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end pt-[4px]"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[263.56px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          ביקור ביקב בוטיק וחלוקת מזכרות מצוות TravelPro.
        </p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[75.72px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#64748b] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">15:30 - 17:00</p>
      </div>
      <Heading5 />
      <Container9 />
    </div>
  );
}

function TimelineItem3() {
  return (
    <div className="relative w-full shrink-0" data-name="Timeline Item 4">
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding">
        <Container8 />
        <div
          className="absolute top-0 right-[-43px] size-[24px] rounded-[9999px] bg-[rgba(255,140,0,0.3)]"
          data-name="Overlay+Border"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[9999px] border-4 border-white border-solid"
          />
        </div>
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div
      className="relative flex w-[346px] shrink-0 flex-col content-stretch items-start gap-[32px] pr-[34px]"
      data-name="VerticalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.2)] border-r-2 border-solid"
      />
      <TimelineItem />
      <TimelineItem1 />
      <TimelineItem2 />
      <TimelineItem3 />
    </div>
  );
}

function TimelineInteractiveSection() {
  return (
    <div
      className="absolute top-[544px] right-0 left-0 flex flex-col content-stretch items-start gap-[24px] px-[16px]"
      data-name="Timeline Interactive Section"
    >
      <Heading1 />
      <VerticalBorder />
    </div>
  );
}

function Heading6() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 2">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[7.99px] pl-[230.88px]">
          <div className="relative flex h-[28px] w-[113.13px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[20px] leading-[0]">
            <p className="whitespace-pre-wrap leading-[28px]">פירוט פעילויות</p>
          </div>
          <div
            className="h-[24px] w-[6px] shrink-0 rounded-[9999px] bg-[#ff8c00]"
            data-name="Background"
          />
        </div>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div
      className="relative min-h-px w-full min-w-px flex-[1_0_0]"
      data-name="טיול ג\'יפים"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute top-[-42.71%] left-0 h-[185.42%] w-full max-w-none"
          height="600"
          src={img1}
          width="800"
        />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative h-[192px] w-full shrink-0" data-name="Container">
      <div className="relative flex size-full flex-col content-stretch items-start justify-center overflow-clip rounded-[inherit] border-0 border-[transparent] border-solid bg-clip-padding">
        <Component2 />
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div
      className="relative z-[1] h-[11.667px] w-[15.667px] shrink-0"
      data-name="Margin"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15.6667 11.6667"
      >
        <title>Interface icon</title>
        <g id="Margin">
          <path
            d={svgPaths.p29478120}
            fill="var(--fill-0, #0F172A)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div
      className="relative isolate flex shrink-0 content-stretch items-center justify-between rounded-[4px] bg-[#f1f5f9] px-[8px] py-[4px]"
      data-name="Background"
    >
      <div className="relative z-[2] flex h-[16px] w-[32.19px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#0f172a] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">3 שעות</p>
      </div>
      <Margin />
    </div>
  );
}

function Heading7() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[28px] w-[140.59px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[20px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">{`מסע ג'יפים אתגרי`}</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-between"
      data-name="Container"
    >
      <Background1 />
      <Heading7 />
    </div>
  );
}

function Container13() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[78px] w-[312.8px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[16px] leading-[26px]">
        <p className="mb-0">{`נצא למסע מרתק בין נחלים ותצפיות מרהיבות. הג'יפים`}</p>
        <p className="mb-0">הם בנהיגה עצמית (לבעלי רישיון) בליווי מדריכים</p>
        <p>מקצועיים של TravelPro. כולל עצירה לקפה בטבע.</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch rounded-[4px] bg-[rgba(255,140,0,0.1)] px-[8px] py-[4px]"
      data-name="Overlay"
    >
      <div className="relative flex h-[15px] w-[46.55px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#ff8c00] text-[10px] uppercase leading-[0] tracking-[0.5px]">
        <p className="whitespace-pre-wrap leading-[15px]">ביטוח מלא</p>
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch rounded-[4px] bg-[rgba(255,140,0,0.1)] px-[8px] py-[4px]"
      data-name="Overlay"
    >
      <div className="relative flex h-[15px] w-[51.02px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#ff8c00] text-[10px] uppercase leading-[0] tracking-[0.5px]">
        <p className="whitespace-pre-wrap leading-[15px]">כולל הדרכה</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start gap-[7.99px] pt-[8px] pl-[178.44px]">
        <Overlay />
        <Overlay1 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding p-[20px]">
        <Container12 />
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function Activity() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Activity 1"
    >
      <div className="relative flex w-full flex-col content-stretch items-start overflow-clip rounded-[inherit] p-px">
        <Container10 />
        <Container11 />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#f1f5f9] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
    </div>
  );
}

function Component3() {
  return (
    <div
      className="relative min-h-px w-full min-w-px flex-[1_0_0]"
      data-name="ארוחת צהריים"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute top-[-42.71%] left-0 h-[185.42%] w-full max-w-none"
          height="600"
          src={img2}
          width="800"
        />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative h-[192px] w-full shrink-0" data-name="Container">
      <div className="relative flex size-full flex-col content-stretch items-start justify-center overflow-clip rounded-[inherit] border-0 border-[transparent] border-solid bg-clip-padding">
        <Component3 />
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div
      className="relative z-[1] h-[11.667px] w-[12.75px] shrink-0"
      data-name="Margin"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 12.75 11.6667"
      >
        <title>Interface icon</title>
        <g id="Margin">
          <path
            d={svgPaths.p16697200}
            fill="var(--fill-0, #0F172A)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div
      className="relative isolate flex shrink-0 content-stretch items-center rounded-[4px] bg-[#f1f5f9] px-[8px] py-[4px]"
      data-name="Background"
    >
      <div className="relative z-[2] flex h-[16px] w-[58.27px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#0f172a] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">כשר למהדרין</p>
      </div>
      <Margin1 />
    </div>
  );
}

function Heading8() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[28px] w-[163.11px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[20px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">סעודת בוקרים בשטח</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-between"
      data-name="Container"
    >
      <Background2 />
      <Heading8 />
    </div>
  );
}

function Container18() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[78px] w-[287.28px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[16px] leading-[26px]">
        <p className="mb-0">ארוחת צהריים עשירה הכוללת נתחי בשר מובחרים</p>
        <p className="mb-0">מהגולן, סלטים טריים, תוספות חמות ושתייה קלה</p>
        <p>חופשית. הארוחה מוגשת תחת הצללה מעוצבת.</p>
      </div>
    </div>
  );
}

function Overlay2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch rounded-[4px] bg-[rgba(255,140,0,0.1)] px-[8px] py-[4px]"
      data-name="Overlay"
    >
      <div className="relative flex h-[15px] w-[69.69px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#ff8c00] text-[10px] uppercase leading-[0] tracking-[0.5px]">
        <p className="whitespace-pre-wrap leading-[15px]">אופציה טבעונית</p>
      </div>
    </div>
  );
}

function Overlay3() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch rounded-[4px] bg-[rgba(255,140,0,0.1)] px-[8px] py-[4px]"
      data-name="Overlay"
    >
      <div className="relative flex h-[15px] w-[50.59px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#ff8c00] text-[10px] uppercase leading-[0] tracking-[0.5px]">
        <p className="whitespace-pre-wrap leading-[15px]">פריסת שטח</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start gap-[8px] pt-[8px] pl-[155.72px]">
        <Overlay2 />
        <Overlay3 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding p-[20px]">
        <Container17 />
        <Container18 />
        <Container19 />
      </div>
    </div>
  );
}

function Activity1() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Activity 2"
    >
      <div className="relative flex w-full flex-col content-stretch items-start overflow-clip rounded-[inherit] p-px">
        <Container15 />
        <Container16 />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#f1f5f9] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
    </div>
  );
}

function SectionActivityCardsVerticalList() {
  return (
    <div
      className="absolute top-[1028px] right-0 left-0 flex flex-col content-stretch items-start gap-[24px] px-[16px]"
      data-name="Section - Activity Cards (Vertical List)"
    >
      <Heading6 />
      <Activity />
      <Activity1 />
    </div>
  );
}

function Heading9() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 2"
    >
      <div className="relative flex h-[28px] w-[136.47px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[20px] text-white leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">מה כלול בחבילה?</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[242.72px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#cbd5e1] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          אוטובוס תיירים צמוד (מאיסוף ועד החזרה)
        </p>
      </div>
    </div>
  );
}

function Container21() {
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
          <path
            d={svgPaths.p1caa9380}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Item() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] pl-[63.27px]">
          <Container20 />
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[219.39px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#cbd5e1] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          ליווי של 2 מדריכי TravelPro מוסמכים
        </p>
      </div>
    </div>
  );
}

function Container23() {
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
          <path
            d={svgPaths.p1caa9380}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Item1() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] pl-[86.59px]">
          <Container22 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[236.78px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#cbd5e1] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          כל הכניסות לאתרים והפעילויות המצוינות
        </p>
      </div>
    </div>
  );
}

function Container25() {
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
          <path
            d={svgPaths.p1caa9380}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Item2() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] pl-[69.2px]">
          <Container24 />
          <Container25 />
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[283.55px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#cbd5e1] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          ערכת עזרה ראשונה ומים מינרליים לאורך כל היום
        </p>
      </div>
    </div>
  );
}

function Container27() {
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
          <path
            d={svgPaths.p1caa9380}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Item3() {
  return (
    <div className="relative w-full shrink-0" data-name="Item">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] pl-[22.44px]">
          <Container26 />
          <Container27 />
        </div>
      </div>
    </div>
  );
}

function List() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[16px] pb-[8px]"
      data-name="List"
    >
      <Item />
      <Item1 />
      <Item2 />
      <Item3 />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-center border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[16px] w-[286.53px] shrink-0 flex-col justify-center text-center font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[16px]">{`המחיר אינו כולל מע"מ כחוק. כפוף לתנאי הביטול המופיעים באתר.`}</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start pt-[25px]"
      data-name="HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#1e293b] border-t border-solid"
      />
      <Container28 />
    </div>
  );
}

function IncludedSection() {
  return (
    <div
      className="absolute top-[1926px] right-0 left-0 flex flex-col content-stretch items-start gap-[24px] rounded-tl-[24px] rounded-tr-[24px] bg-[#0f172a] px-[24px] py-[32px]"
      data-name="Included Section"
    >
      <Heading9 />
      <List />
      <HorizontalBorder />
    </div>
  );
}

function Container29() {
  return (
    <div
      className="absolute top-[44px] right-[16px] left-[16px] flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[19.41px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">אזור</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div
      className="absolute top-[60px] right-[16px] left-[16px] flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[63.66px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">רמת הגולן</p>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div
      className="absolute inset-[16px_288px_16px_-18px] rounded-[12px] border border-[#f1f5f9] border-solid bg-white"
      data-name="Background+Border"
    >
      <div
        className="absolute inset-[-1px] rounded-[12px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div
        className="absolute top-[18px] left-[81.98px] h-[20px] w-[16px]"
        data-name="Icon"
      >
        <svg
          className="absolute inset-0 block"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 16 20"
        >
          <title>Interface icon</title>
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
    <div
      className="absolute top-[44px] right-[16px] left-[16px] flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[45.48px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">משתתפים</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="absolute top-[60px] right-[16px] left-[16px] flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[44.83px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">45 איש</p>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div
      className="absolute inset-[16px_152px_16px_118px] rounded-[12px] border border-[#f1f5f9] border-solid bg-white"
      data-name="Background+Border"
    >
      <div
        className="absolute inset-[-1px] rounded-[12px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div
        className="absolute top-[20px] left-[78.98px] h-[16px] w-[22px]"
        data-name="Icon"
      >
        <svg
          className="absolute inset-0 block"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 22 16"
        >
          <title>Interface icon</title>
          <path
            d={svgPaths.p39955c80}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </svg>
      </div>
      <Container31 />
      <Container32 />
    </div>
  );
}

function Container33() {
  return (
    <div
      className="absolute top-[44px] right-[16px] left-[16px] flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[46.25px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">תאריך יעד</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div
      className="absolute top-[60px] right-[16px] left-[16px] flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[74.86px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">15.10.2024</p>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div
      className="absolute inset-[16px_16px_16px_254px] rounded-[12px] border border-[#f1f5f9] border-solid bg-white"
      data-name="Background+Border"
    >
      <div
        className="absolute inset-[-1px] rounded-[12px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div
        className="absolute top-[18px] left-[80.98px] h-[20px] w-[18px]"
        data-name="Icon"
      >
        <svg
          className="absolute inset-0 block"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 18 20"
        >
          <title>Interface icon</title>
          <path
            d={svgPaths.p2a946800}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </svg>
      </div>
      <Container33 />
      <Container34 />
    </div>
  );
}

function SummaryStats() {
  return (
    <div
      className="absolute top-[378px] right-0 left-0 h-[134px] overflow-clip"
      data-name="Summary Stats"
    >
      <BackgroundBorder />
      <BackgroundBorder1 />
      <BackgroundBorder2 />
    </div>
  );
}

function Container35() {
  return (
    <div className="relative h-[20px] w-[18px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 20"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p2b729200}
            fill="var(--fill-0, #0F172A)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative shrink-0 rounded-[9999px]" data-name="Button">
      <div className="relative flex flex-col content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding p-[8px]">
        <Container35 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[28px] w-[79.98px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[20px] leading-[0] tracking-[-0.5px]">
        <p className="whitespace-pre-wrap">
          <span className="leading-[28px]">Travel</span>
          <span className="font-['Assistant:Bold',sans-serif] font-bold text-[#ff8c00] leading-[28px]">
            Pro
          </span>
        </p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div
      className="relative h-[25px] w-[25.625px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 25.625 25"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p37c3ec80}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container37 />
        <Container38 />
      </div>
    </div>
  );
}

function HeaderNavbar() {
  return (
    <div
      className="absolute top-[37px] right-0 left-0 flex content-stretch items-center justify-between bg-[rgba(255,255,255,0.8)] px-[16px] pt-[12px] pb-[13px] backdrop-blur-[6px]"
      data-name="Header / Navbar"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e2e8f0] border-b border-solid"
      />
      <Button />
      <Container36 />
    </div>
  );
}

function Container39() {
  return (
    <div className="relative h-[16px] w-[19px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 19 16"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.pb36e280} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="relative min-h-px min-w-px flex-[1_0_0] rounded-[12px] bg-[#ff8c00]"
      data-name="Button"
    >
      <div className="flex size-full flex-row items-center justify-center">
        <div className="relative flex w-full content-stretch items-center justify-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding px-[32px] py-[12px]">
          <Container39 />
          <div className="relative flex h-[24px] w-[67.75px] shrink-0 flex-col justify-center text-center font-['Assistant:Bold',sans-serif] font-bold text-[16px] text-white leading-[0]">
            <p className="whitespace-pre-wrap leading-[24px]">אשר הצעה</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[61.77px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">סה״כ לתשלום</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div
      className="absolute top-[13px] left-0 flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[77.7px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">(₪330 למשתתף)</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div
      className="absolute top-0 left-[81.71px] flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[32px] w-[88.81px] shrink-0 flex-col justify-center text-right font-['Assistant:Bold',sans-serif] font-bold text-[#0f172a] text-[24px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">₪14,850</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative h-[32px] w-full shrink-0" data-name="Container">
      <Container43 />
      <Container44 />
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding">
        <Container41 />
        <Container42 />
      </div>
    </div>
  );
}

function StickyFooter() {
  return (
    <div
      className="absolute right-0 bottom-0 left-0 flex content-stretch items-center justify-between bg-white px-[16px] pt-[17px] pb-[32px]"
      data-name="Sticky Footer"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e2e8f0] border-t border-solid shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.1)]"
      />
      <Button1 />
      <Container40 />
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div
      className="absolute top-0 right-0 left-0 flex flex-col content-stretch items-center bg-[#0f172a] px-[16px] pt-[8px] pb-[9px]"
      data-name="Background+HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#334155] border-b border-solid"
      />
      <div className="relative flex h-[20px] w-[224.03px] shrink-0 flex-col justify-center text-center font-['Assistant:Bold',sans-serif] font-bold text-[14px] text-white uppercase leading-[0] tracking-[0.35px]">
        <p className="whitespace-pre-wrap leading-[20px]">
          SCREEN LABEL: הצעה ללקוח (מובייל)
        </p>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div
      className="relative size-full bg-[#f8f7f5]"
      data-name="הצעה ללקוח מובייל - עם תווית"
    >
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
