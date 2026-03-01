import svgPaths from "./svg-hf2rtnf24m";

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-[#1a2a40] relative shrink-0 w-full z-[4]" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.3)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[9px] pt-[8px] px-[16px] relative w-full">
          <div className="absolute bg-[rgba(255,255,255,0)] inset-0 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-name="Overlay+Shadow" />
          <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold','Arimo:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white w-[202.72px]">
            <p className="leading-[20px] whitespace-pre-wrap">SCREEN LABEL: אשף סיווג ספקים</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-right text-white w-[230.2px]">
        <p className="leading-[20px] whitespace-pre-wrap">{`הספק "גמא שירותי מחשוב" סווג בהצלחה`}</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p1caa9380} fill="var(--fill-0, #4ADE80)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#1a2a40] content-stretch flex gap-[12px] items-center opacity-0 px-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="Background">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.02px_0_0] rounded-[12px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]" data-name="Overlay+Shadow" />
      <Container />
      <Container1 />
    </div>
  );
}

function SuccessToastsAreaSimulated() {
  return (
    <div className="absolute bottom-[24px] content-stretch flex flex-col items-start right-[24px] z-[3]" data-name="Success Toasts Area (Simulated)">
      <Background />
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p2816f2c0} fill="var(--fill-0, #1A2A40)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f8f7f5] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="Button">
      <Container3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #1A2A40)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#f8f7f5] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="Button">
      <Container4 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] text-right w-[98.92px]">
        <p className="leading-[16px] whitespace-pre-wrap">45 מתוך 100 ספקים</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[12px] text-right w-[66.03px]">
        <p className="leading-[16px] whitespace-pre-wrap">45% הושלמו</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Container7 />
      <Container8 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#f1f5f9] h-[6px] relative rounded-[9999px] shrink-0 w-[192px]" data-name="Background">
      <div className="absolute bg-[#ff8c00] inset-[0_0_0_55.01%] rounded-[9999px]" data-name="Background" />
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col h-[10px] items-start pt-[4px] relative shrink-0 w-[192px]" data-name="Margin">
      <Background1 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container6 />
      <Margin1 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[16px] relative shrink-0" data-name="Margin">
      <Container5 />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Button />
        <Button1 />
        <Margin />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[25px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[20px] text-right tracking-[-0.3px] w-[175.84px]">
        <p className="leading-[25px] whitespace-pre-wrap">אשף סיווג ספקים מרוכז</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[19px] relative shrink-0 w-[21px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 21 19">
        <g id="Container">
          <path d={svgPaths.pad7c4e0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Background">
      <Container10 />
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Heading1 />
        <Background2 />
      </div>
    </div>
  );
}

function HeaderTopNavigationBar() {
  return (
    <div className="bg-white relative shrink-0 w-full z-[2]" data-name="Header - Top Navigation Bar">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.2)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[13px] pt-[12px] px-[40px] relative w-full">
          <Container2 />
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-white content-stretch flex flex-col items-end px-[13px] py-[5px] relative rounded-[9999px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium','Arimo:Regular',sans-serif] font-medium h-[16px] justify-center leading-[0] relative shrink-0 text-[#475569] text-[12px] text-right w-[129.02px]">
        <p className="leading-[16px] whitespace-pre-wrap">ייבוא אקסל: 12/05/2024</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative">
        <BackgroundBorder />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 1">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[24px] text-right w-[170.58px]">
        <p className="leading-[32px] whitespace-pre-wrap">{`אלפא שיווק בע"מ`}</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[0.5px] items-end relative">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[12px] text-right tracking-[0.6px] uppercase w-[52.47px]">
          <p className="leading-[16px] whitespace-pre-wrap">ספק נוכחי</p>
        </div>
        <Heading />
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder1() {
  return (
    <div className="bg-[#f8fafc] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#f1f5f9] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[24px] relative w-full">
          <Container11 />
          <Container12 />
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[75.69px]">
        <p className="leading-[16px] whitespace-pre-wrap">קטגוריה מקורית</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p3dc33e00} fill="var(--fill-0, #CBD5E1)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold_Italic',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[88.98px]">
        <p className="leading-[20px] whitespace-pre-wrap">{`"כללי - אקסל"`}</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center pl-[84.5px] relative w-full">
          <Container17 />
          <Container18 />
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative self-stretch" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[32.73px]">
        <p className="leading-[16px] whitespace-pre-wrap">כתובת</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[151.2px]">
        <p className="leading-[20px] whitespace-pre-wrap">רחוב הנביאים 22, תל אביב</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative self-stretch" data-name="Container">
      <Container20 />
      <Container21 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[26.41px]">
        <p className="leading-[16px] whitespace-pre-wrap">טלפון</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[94.25px]">
        <p className="leading-[20px] whitespace-pre-wrap">050-1234567</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative self-stretch" data-name="Container">
      <Container23 />
      <Container24 />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[86.11px]">
        <p className="leading-[16px] whitespace-pre-wrap">מזהה ספק (מקורי)</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[47.66px]">
        <p className="leading-[20px] whitespace-pre-wrap">987321</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative self-stretch" data-name="Container">
      <Container26 />
      <Container27 />
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-start justify-center p-[24px] relative w-full">
          <Container14 />
          <Container19 />
          <Container22 />
          <Container25 />
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex isolate items-start justify-end leading-[0] relative shrink-0 text-[#1a2a40] text-[14px] text-right" data-name="Paragraph">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center not-italic relative shrink-0 w-[191.13px] z-[5]">
        <p className="leading-[20px] whitespace-pre-wrap">. ייתכן שמדובר בספק שירותי מדיה.</p>
      </div>
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center not-italic relative shrink-0 w-[48.83px] z-[4]">
        <p className="[text-decoration-skip-ink:none] decoration-solid leading-[20px] underline whitespace-pre-wrap">תל אביב</p>
      </div>
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 w-[6.17px] z-[3]">
        <p className="leading-[20px] whitespace-pre-wrap">{`, `}</p>
      </div>
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center not-italic relative shrink-0 w-[28.09px] z-[2]">
        <p className="[text-decoration-skip-ink:none] decoration-solid leading-[20px] underline whitespace-pre-wrap">שיווק</p>
      </div>
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center not-italic relative shrink-0 w-[106.09px] z-[1]">
        <p className="leading-[20px] whitespace-pre-wrap">{`זיהינו מילות מפתח: `}</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 15 20">
        <g id="Container">
          <path d={svgPaths.pb720300} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(255,140,0,0.05)] relative shrink-0 w-full" data-name="Overlay">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pl-[445.67px] pr-[24px] py-[16px] relative w-full">
          <Paragraph />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function SectionContextCard() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Section - Context Card">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <BackgroundHorizontalBorder1 />
        <Container13 />
        <Overlay />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,140,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex isolate items-start justify-end leading-[0] relative shrink-0 text-[14px] text-right w-full" data-name="Label">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center relative shrink-0 text-[#ff8c00] w-[7.56px] z-[2]">
        <p className="leading-[20px] whitespace-pre-wrap">*</p>
      </div>
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center not-italic relative shrink-0 text-[#1a2a40] w-[75.8px] z-[1]">
        <p className="leading-[20px] whitespace-pre-wrap">{`תת-קטגוריה `}</p>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="SVG">
          <path d="M6.3 8.4L10.5 12.6L14.7 8.4" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.575" />
        </g>
      </svg>
    </div>
  );
}

function ImageFill() {
  return (
    <div className="absolute content-stretch flex flex-col h-[46px] items-end justify-center left-0 overflow-clip pl-[290px] pr-[9px] py-[12.5px] top-0 w-[320px]" data-name="image fill">
      <Svg />
    </div>
  );
}

function Container32() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-end left-[17px] overflow-clip right-[17px] top-1/2" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[57.19px]">
        <p className="leading-[20px] whitespace-pre-wrap">רכש מדיה</p>
      </div>
    </div>
  );
}

function Options() {
  return (
    <div className="bg-[#f8f7f5] h-[46px] relative rounded-[8px] shrink-0 w-full" data-name="Options">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ImageFill />
      <Container32 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Options />
      <div className="absolute h-[7.4px] left-[18px] top-[19.98px] w-[12px]" data-name="Icon">
        <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7.4">
          <path d={svgPaths.p1adfde00} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function SubCategorySelection() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative self-stretch" data-name="Sub-category Selection">
      <Label />
      <Container31 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex isolate items-start justify-end leading-[0] relative shrink-0 text-[14px] text-right w-full" data-name="Label">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center relative shrink-0 text-[#ff8c00] w-[7.56px] z-[2]">
        <p className="leading-[20px] whitespace-pre-wrap">*</p>
      </div>
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center not-italic relative shrink-0 text-[#1a2a40] w-[90.55px] z-[1]">
        <p className="leading-[20px] whitespace-pre-wrap">{`קטגוריה ראשית `}</p>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="SVG">
          <path d="M6.3 8.4L10.5 12.6L14.7 8.4" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.575" />
        </g>
      </svg>
    </div>
  );
}

function ImageFill1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[46px] items-end justify-center left-0 overflow-clip pl-[290px] pr-[9px] py-[12.5px] top-0 w-[320px]" data-name="image fill">
      <Svg1 />
    </div>
  );
}

function Container34() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-end left-[17px] overflow-clip right-[17px] top-1/2" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[69.23px]">
        <p className="leading-[20px] whitespace-pre-wrap">שיווק ופרסום</p>
      </div>
    </div>
  );
}

function Options1() {
  return (
    <div className="bg-[#f8f7f5] h-[46px] relative rounded-[8px] shrink-0 w-full" data-name="Options">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ImageFill1 />
      <Container34 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Options1 />
      <div className="absolute h-[7.4px] left-[18px] top-[19.98px] w-[12px]" data-name="Icon">
        <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7.4">
          <path d={svgPaths.p1adfde00} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function CategorySelection() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative self-stretch" data-name="Category Selection">
      <Label1 />
      <Container33 />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex gap-[32px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <SubCategorySelection />
      <CategorySelection />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[119.59px]">
        <p className="leading-[20px] whitespace-pre-wrap">תגיות (בחירה מרובה)</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-end min-h-px min-w-px overflow-clip pb-px relative" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[18px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-right w-[71.19px]">
        <p className="leading-[normal] whitespace-pre-wrap">הוסף תגית...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="content-stretch flex items-start justify-center overflow-clip pt-px relative shrink-0 w-full" data-name="Input">
      <Container37 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-[120px] relative self-stretch" data-name="Container">
      <Input />
    </div>
  );
}

function Button2() {
  return (
    <div className="relative shrink-0 size-[7px]" data-name="Button">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
        <g id="Button">
          <path d={svgPaths.p233c0280} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex gap-[4px] items-center px-[12px] py-[6px] relative rounded-[9999px] self-stretch shrink-0" data-name="Background">
      <Button2 />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-right text-white w-[41.86px]">
        <p className="leading-[16px] whitespace-pre-wrap">תל אביב</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="relative shrink-0 size-[7px]" data-name="Button">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
        <g id="Button">
          <path d={svgPaths.p233c0280} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex gap-[3.99px] items-center px-[12px] py-[6px] relative rounded-[9999px] self-stretch shrink-0" data-name="Background">
      <Button3 />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-right text-white w-[54.63px]">
        <p className="leading-[16px] whitespace-pre-wrap">ספק מועדף</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative shrink-0 size-[7px]" data-name="Button">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
        <g id="Button">
          <path d={svgPaths.p233c0280} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex gap-[3.99px] items-center px-[12px] py-[6px] relative rounded-[9999px] self-stretch shrink-0" data-name="Background">
      <Button4 />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-right text-white w-[32.08px]">
        <p className="leading-[16px] whitespace-pre-wrap">דיגיטל</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative w-full">
        <Container36 />
        <Background3 />
        <Background4 />
        <Background5 />
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#f8f7f5] min-h-[100px] relative rounded-[8px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start min-h-[inherit] pb-[59px] pt-[13px] px-[13px] relative w-full">
        <Container35 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex flex-col items-center justify-center px-[9px] py-[3px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[12px] text-center w-[33.42px]">
        <p className="leading-[16px] whitespace-pre-wrap">+ דחוף</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex flex-col items-center justify-center px-[9px] py-[3px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[12px] text-center w-[33.81px]">
        <p className="leading-[16px] whitespace-pre-wrap">+ שנתי</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex flex-col items-center justify-center px-[9px] py-[3px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#475569] text-[12px] text-center w-[33.16px]">
        <p className="leading-[16px] whitespace-pre-wrap">+ B2B</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-end relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[34.94px]">
        <p className="leading-[16px] whitespace-pre-wrap">מומלץ:</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-start pb-[4px] pl-[458.67px] relative w-full">
          <Button5 />
          <Button6 />
          <Button7 />
          <Container39 />
        </div>
      </div>
    </div>
  );
}

function TagsSelection() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Tags Selection">
      <Label2 />
      <BackgroundBorder1 />
      <Container38 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex isolate items-start justify-end leading-[0] relative shrink-0 text-[12px] text-[rgba(26,42,64,0.7)] text-right" data-name="Paragraph">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center not-italic relative shrink-0 w-[37.59px] z-[5]">
        <p className="leading-[16px] whitespace-pre-wrap">{` לדילוג.`}</p>
      </div>
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[16px] justify-center relative shrink-0 w-[20.61px] z-[4]">
        <p className="leading-[16px] whitespace-pre-wrap">Esc</p>
      </div>
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center not-italic relative shrink-0 w-[99.78px] z-[3]">
        <p className="leading-[16px] whitespace-pre-wrap">{` לאישור ומעבר לבא, `}</p>
      </div>
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[16px] justify-center relative shrink-0 w-[30.98px] z-[2]">
        <p className="leading-[16px] whitespace-pre-wrap">Enter</p>
      </div>
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center not-italic relative shrink-0 w-[124.83px] z-[1]">
        <p className="leading-[16px] whitespace-pre-wrap">{`טיפ למהירות: השתמש ב- `}</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-full items-start relative">
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-full items-start relative">
        <div className="h-[14px] relative shrink-0 w-[20px]" data-name="Icon">
          <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 14">
            <path d={svgPaths.p2e758b40} fill="var(--fill-0, #FF8C00)" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(255,140,0,0.05)] relative rounded-[8px] shrink-0 w-full" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,140,0,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex gap-[15.99px] items-start pl-[301.19px] pr-[17px] py-[17px] relative w-full">
        <Container40 />
        <Container41 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="max-w-[672px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[32px] items-start max-w-[inherit] relative w-full">
        <Container30 />
        <TagsSelection />
        <OverlayBorder />
      </div>
    </div>
  );
}

function SectionClassificationForm() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px] w-full" data-name="Section - Classification Form">
      <div aria-hidden="true" className="absolute border border-[rgba(255,140,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start px-[108px] py-[33px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0_-0.5px_0] rounded-[12px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-name="Section - Classification Form:shadow" />
        <Container29 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p300a1100} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex gap-[8px] items-center justify-center px-[40px] py-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.01px_0_0] rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(255,140,0,0.2),0px_4px_6px_-4px_rgba(255,140,0,0.2)]" data-name="Button:shadow" />
      <Container43 />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[110.52px]">
        <p className="leading-[24px] whitespace-pre-wrap">אשר והמשך לבא</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative">
        <Button8 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[12px] relative shrink-0 w-[19px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 19 12">
        <g id="Container">
          <path d={svgPaths.p2e7ab880} fill="var(--fill-0, #64748B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[25px] py-[13px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[16px] text-center w-[100.08px]">
        <p className="leading-[24px] whitespace-pre-wrap">דלג לספק הבא</p>
      </div>
      <Container45 />
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.pf86ae00} fill="var(--fill-0, #64748B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[25px] py-[13px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[16px] text-center w-[87.78px]">
        <p className="leading-[24px] whitespace-pre-wrap">העבר לארכיון</p>
      </div>
      <Container46 />
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start relative">
        <Button9 />
        <Button10 />
      </div>
    </div>
  );
}

function SectionActionToolbar() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Section - Action Toolbar">
      <div aria-hidden="true" className="absolute border border-[rgba(255,140,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[25px] relative w-full">
          <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Section - Action Toolbar:shadow" />
          <Container42 />
          <Container44 />
        </div>
      </div>
    </div>
  );
}

function MainWizardArea() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px relative self-stretch" data-name="Main Wizard Area">
      <SectionContextCard />
      <SectionClassificationForm />
      <SectionActionToolbar />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p3f18d400} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pl-[151.95px] relative w-full">
          <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[112.03px]">
            <p className="leading-[20px] whitespace-pre-wrap">תור ספקים להסדרה</p>
          </div>
          <Container47 />
        </div>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[99.5px]">
          <p className="leading-[20px] whitespace-pre-wrap">{`אלפא שיווק בע"מ`}</p>
        </div>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[12px] text-right w-[72.27px]">
          <p className="leading-[16px] whitespace-pre-wrap">מזהה: 987321</p>
        </div>
      </div>
    </div>
  );
}

function OverlayVerticalBorder() {
  return (
    <div className="bg-[rgba(255,140,0,0.1)] relative rounded-[8px] shrink-0 w-full" data-name="Overlay+VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#ff8c00] border-r-4 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start pl-[12px] pr-[16px] py-[12px] relative w-full">
        <Container49 />
        <Container50 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[85.88px]">
          <p className="leading-[20px] whitespace-pre-wrap">בטא לוגיסטיקה</p>
        </div>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[70px]">
          <p className="leading-[16px] whitespace-pre-wrap">מזהה: 112233</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-r-4 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start pl-[12px] pr-[16px] py-[12px] relative w-full">
        <Container51 />
        <Container52 />
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[105.27px]">
          <p className="leading-[20px] whitespace-pre-wrap">גמא שירותי מחשוב</p>
        </div>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[76.31px]">
          <p className="leading-[16px] whitespace-pre-wrap">מזהה: 445566</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder1() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-r-4 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start pl-[12px] pr-[16px] py-[12px] relative w-full">
        <Container53 />
        <Container54 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[115.41px]">
          <p className="leading-[20px] whitespace-pre-wrap">דלתא בנייה ושיפוצים</p>
        </div>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#94a3b8] text-[12px] text-right w-[74.52px]">
          <p className="leading-[16px] whitespace-pre-wrap">מזהה: 778899</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder2() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-r-4 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start pl-[12px] pr-[16px] py-[12px] relative w-full">
        <Container55 />
        <Container56 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative w-full">
        <OverlayVerticalBorder />
        <VerticalBorder />
        <VerticalBorder1 />
        <VerticalBorder2 />
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center py-[8px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[12px] text-center w-[111.86px]">
          <p className="leading-[16px] whitespace-pre-wrap">צפה בכל ה-55 שנותרו</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[rgba(255,140,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[17px] relative w-full">
        <Heading2 />
        <Container48 />
        <Button11 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[14px] text-right w-[105.27px]">
          <p className="leading-[20px] whitespace-pre-wrap">סטטיסטיקת עבודה</p>
        </div>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2a40] text-[12px] text-right w-[75.3px]">
        <p className="leading-[16px] whitespace-pre-wrap">12 ספקים/שעה</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] text-right w-[43.86px]">
        <p className="leading-[16px] whitespace-pre-wrap">קצב סיווג</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container59 />
      <Container60 />
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[#1a2a40] text-[12px] text-right w-[54.3px]">
        <p className="leading-[16px] whitespace-pre-wrap">01:24:00</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] text-right w-[69.5px]">
        <p className="leading-[16px] whitespace-pre-wrap">זמן עבודה היום</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container62 />
      <Container63 />
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative w-full">
        <Container58 />
        <Container61 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[rgba(255,140,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[17px] relative w-full">
        <Heading3 />
        <Container57 />
      </div>
    </div>
  );
}

function AsideSidebarQueue() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative self-stretch shrink-0 w-[320px]" data-name="Aside - Sidebar: Queue">
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
    </div>
  );
}

function Main() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full z-[1]" data-name="Main">
      <div className="content-stretch flex gap-[24px] items-start max-w-[inherit] p-[24px] relative w-full">
        <MainWizardArea />
        <AsideSidebarQueue />
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#f8f7f5] content-stretch flex flex-col isolate items-start relative size-full" data-name="אשף סיווג ספקים - עם תווית">
      <BackgroundHorizontalBorder />
      <SuccessToastsAreaSimulated />
      <HeaderTopNavigationBar />
      <Main />
    </div>
  );
}