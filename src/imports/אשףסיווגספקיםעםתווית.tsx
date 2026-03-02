import svgPaths from "./svg-hf2rtnf24m";

function BackgroundHorizontalBorder() {
  return (
    <div
      className="relative z-[4] w-full shrink-0 bg-[#1a2a40]"
      data-name="Background+HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.3)] border-b border-solid"
      />
      <div className="flex size-full flex-col items-center">
        <div className="relative flex w-full flex-col content-stretch items-center px-[16px] pt-[8px] pb-[9px]">
          <div
            className="absolute inset-0 bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
            data-name="Overlay+Shadow"
          />
          <div className="relative flex h-[20px] w-[202.72px] shrink-0 flex-col justify-center text-center font-['Plus_Jakarta_Sans:Bold','Arimo:Bold',sans-serif] font-bold text-[14px] text-white leading-[0]">
            <p className="whitespace-pre-wrap leading-[20px]">
              SCREEN LABEL: אשף סיווג ספקים
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[230.2px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[14px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">{`הספק "גמא שירותי מחשוב" סווג בהצלחה`}</p>
      </div>
    </div>
  );
}

function Container1() {
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
            fill="var(--fill-0, #4ADE80)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[12px] rounded-[12px] bg-[#1a2a40] px-[24px] py-[12px] opacity-0"
      data-name="Background"
    >
      <div
        className="absolute inset-[0_-0.02px_0_0] rounded-[12px] bg-[rgba(255,255,255,0)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
        data-name="Overlay+Shadow"
      />
      <Container />
      <Container1 />
    </div>
  );
}

function SuccessToastsAreaSimulated() {
  return (
    <div
      className="absolute right-[24px] bottom-[24px] z-[3] flex flex-col content-stretch items-start"
      data-name="Success Toasts Area (Simulated)"
    >
      <Background />
    </div>
  );
}

function Container3() {
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
            d={svgPaths.p2816f2c0}
            fill="var(--fill-0, #1A2A40)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div
      className="relative flex size-[40px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#f8f7f5]"
      data-name="Button"
    >
      <Container3 />
    </div>
  );
}

function Container4() {
  return (
    <div
      className="relative h-[20px] w-[20.1px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20.1 20"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3cdadd00}
            fill="var(--fill-0, #1A2A40)"
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
      className="relative flex size-[40px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#f8f7f5]"
      data-name="Button"
    >
      <Container4 />
    </div>
  );
}

function Container7() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[98.92px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">45 מתוך 100 ספקים</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[66.03px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">45% הושלמו</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px]"
      data-name="Container"
    >
      <Container7 />
      <Container8 />
    </div>
  );
}

function Background1() {
  return (
    <div
      className="relative h-[6px] w-[192px] shrink-0 rounded-[9999px] bg-[#f1f5f9]"
      data-name="Background"
    >
      <div
        className="absolute inset-[0_0_0_55.01%] rounded-[9999px] bg-[#ff8c00]"
        data-name="Background"
      />
    </div>
  );
}

function Margin1() {
  return (
    <div
      className="relative flex h-[10px] w-[192px] shrink-0 flex-col content-stretch items-start pt-[4px]"
      data-name="Margin"
    >
      <Background1 />
    </div>
  );
}

function Container5() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <Container6 />
      <Margin1 />
    </div>
  );
}

function Margin() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start pr-[16px]"
      data-name="Margin"
    >
      <Container5 />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Button />
        <Button1 />
        <Margin />
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
      <div className="relative flex h-[25px] w-[175.84px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2a40] text-[20px] not-italic leading-[0] tracking-[-0.3px]">
        <p className="whitespace-pre-wrap leading-[25px]">
          אשף סיווג ספקים מרוכז
        </p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative h-[19px] w-[21px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 21 19"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.pad7c4e0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#ff8c00]"
      data-name="Background"
    >
      <Container10 />
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Heading1 />
        <Background2 />
      </div>
    </div>
  );
}

function HeaderTopNavigationBar() {
  return (
    <div
      className="relative z-[2] w-full shrink-0 bg-white"
      data-name="Header - Top Navigation Bar"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.2)] border-b border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between px-[40px] pt-[12px] pb-[13px]">
          <Container2 />
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch rounded-[9999px] bg-white px-[13px] py-[5px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[9999px] border border-[#e2e8f0] border-solid"
      />
      <div className="relative flex h-[16px] w-[129.02px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Medium','Arimo:Regular',sans-serif] font-medium text-[#475569] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">
          ייבוא אקסל: 12/05/2024
        </p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding">
        <BackgroundBorder />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 1"
    >
      <div className="relative flex h-[32px] w-[170.58px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2a40] text-[24px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[32px]">{`אלפא שיווק בע"מ`}</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex flex-col content-stretch items-end gap-[0.5px] border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[16px] w-[52.47px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[12px] uppercase not-italic leading-[0] tracking-[0.6px]">
          <p className="whitespace-pre-wrap leading-[16px]">ספק נוכחי</p>
        </div>
        <Heading />
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder1() {
  return (
    <div
      className="relative w-full shrink-0 bg-[#f8fafc]"
      data-name="Background+HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f1f5f9] border-b border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between border-0 border-[transparent] border-solid bg-clip-padding px-[24px] pt-[16px] pb-[17px]">
          <Container11 />
          <Container12 />
        </div>
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
      <div className="relative flex h-[16px] w-[75.69px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#94a3b8] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">קטגוריה מקורית</p>
      </div>
    </div>
  );
}

function Container17() {
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
          <path
            d={svgPaths.p3dc33e00}
            fill="var(--fill-0, #CBD5E1)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[88.98px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold_Italic',sans-serif] text-[#1a2a40] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">{`"כללי - אקסל"`}</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[4px] pl-[84.5px]">
          <Container17 />
          <Container18 />
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-start gap-[4px] self-stretch"
      data-name="Container"
    >
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container20() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[32.73px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#94a3b8] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">כתובת</p>
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
      <div className="relative flex h-[20px] w-[151.2px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2a40] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          רחוב הנביאים 22, תל אביב
        </p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-start gap-[4px] self-stretch"
      data-name="Container"
    >
      <Container20 />
      <Container21 />
    </div>
  );
}

function Container23() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[26.41px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#94a3b8] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">טלפון</p>
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
      <div className="relative flex h-[20px] w-[94.25px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#1a2a40] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">050-1234567</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-start gap-[4px] self-stretch"
      data-name="Container"
    >
      <Container23 />
      <Container24 />
    </div>
  );
}

function Container26() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[86.11px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#94a3b8] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מזהה ספק (מקורי)</p>
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
      <div className="relative flex h-[20px] w-[47.66px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#1a2a40] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">987321</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-start gap-[4px] self-stretch"
      data-name="Container"
    >
      <Container26 />
      <Container27 />
    </div>
  );
}

function Container13() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row justify-center">
        <div className="relative flex w-full content-stretch items-start justify-center gap-[24px] border-0 border-[transparent] border-solid bg-clip-padding p-[24px]">
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
    <div
      className="relative isolate flex shrink-0 content-stretch items-start justify-end text-right text-[#1a2a40] text-[14px] leading-[0]"
      data-name="Paragraph"
    >
      <div className="relative z-[5] flex h-[20px] w-[191.13px] shrink-0 flex-col justify-center font-['FreeSans:Regular',sans-serif] not-italic">
        <p className="whitespace-pre-wrap leading-[20px]">
          . ייתכן שמדובר בספק שירותי מדיה.
        </p>
      </div>
      <div className="relative z-[4] flex h-[20px] w-[48.83px] shrink-0 flex-col justify-center font-['FreeSans:Semi_Bold',sans-serif] not-italic">
        <p className="whitespace-pre-wrap leading-[20px] underline decoration-solid [text-decoration-skip-ink:none]">
          תל אביב
        </p>
      </div>
      <div className="relative z-[3] flex h-[20px] w-[6.17px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal">
        <p className="whitespace-pre-wrap leading-[20px]">{", "}</p>
      </div>
      <div className="relative z-[2] flex h-[20px] w-[28.09px] shrink-0 flex-col justify-center font-['FreeSans:Semi_Bold',sans-serif] not-italic">
        <p className="whitespace-pre-wrap leading-[20px] underline decoration-solid [text-decoration-skip-ink:none]">
          שיווק
        </p>
      </div>
      <div className="relative z-[1] flex h-[20px] w-[106.09px] shrink-0 flex-col justify-center font-['FreeSans:Regular',sans-serif] not-italic">
        <p className="whitespace-pre-wrap leading-[20px]">
          {"זיהינו מילות מפתח: "}
        </p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative h-[20px] w-[15px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 20"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.pb720300} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div
      className="relative w-full shrink-0 bg-[rgba(255,140,0,0.05)]"
      data-name="Overlay"
    >
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding py-[16px] pr-[24px] pl-[445.67px]">
          <Paragraph />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function SectionContextCard() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Section - Context Card"
    >
      <div className="relative flex w-full flex-col content-stretch items-start overflow-clip rounded-[inherit] p-px">
        <BackgroundHorizontalBorder1 />
        <Container13 />
        <Overlay />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,140,0,0.1)] border-solid shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
      />
    </div>
  );
}

function Label() {
  return (
    <div
      className="relative isolate flex w-full shrink-0 content-stretch items-start justify-end text-right text-[14px] leading-[0]"
      data-name="Label"
    >
      <div className="relative z-[2] flex h-[20px] w-[7.56px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#ff8c00]">
        <p className="whitespace-pre-wrap leading-[20px]">*</p>
      </div>
      <div className="relative z-[1] flex h-[20px] w-[75.8px] shrink-0 flex-col justify-center font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2a40] not-italic">
        <p className="whitespace-pre-wrap leading-[20px]">{"תת-קטגוריה "}</p>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative size-[21px] shrink-0" data-name="SVG">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 21 21"
      >
        <title>Interface icon</title>
        <g id="SVG">
          <path
            d="M6.3 8.4L10.5 12.6L14.7 8.4"
            id="Vector"
            stroke="var(--stroke-0, #6B7280)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.575"
          />
        </g>
      </svg>
    </div>
  );
}

function ImageFill() {
  return (
    <div
      className="absolute top-0 left-0 flex h-[46px] w-[320px] flex-col content-stretch items-end justify-center overflow-clip py-[12.5px] pr-[9px] pl-[290px]"
      data-name="image fill"
    >
      <Svg />
    </div>
  );
}

function Container32() {
  return (
    <div
      className="absolute top-1/2 right-[17px] left-[17px] flex -translate-y-1/2 flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[57.19px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#1a2a40] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">רכש מדיה</p>
      </div>
    </div>
  );
}

function Options() {
  return (
    <div
      className="relative h-[46px] w-full shrink-0 rounded-[8px] bg-[#f8f7f5]"
      data-name="Options"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[#e2e8f0] border-solid"
      />
      <ImageFill />
      <Container32 />
    </div>
  );
}

function Container31() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <Options />
      <div
        className="absolute top-[19.98px] left-[18px] h-[7.4px] w-[12px]"
        data-name="Icon"
      >
        <svg
          className="absolute inset-0 block"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 12 7.4"
        >
          <title>Interface icon</title>
          <path
            d={svgPaths.p1adfde00}
            fill="var(--fill-0, #94A3B8)"
            id="Icon"
          />
        </svg>
      </div>
    </div>
  );
}

function SubCategorySelection() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-start gap-[8px] self-stretch"
      data-name="Sub-category Selection"
    >
      <Label />
      <Container31 />
    </div>
  );
}

function Label1() {
  return (
    <div
      className="relative isolate flex w-full shrink-0 content-stretch items-start justify-end text-right text-[14px] leading-[0]"
      data-name="Label"
    >
      <div className="relative z-[2] flex h-[20px] w-[7.56px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#ff8c00]">
        <p className="whitespace-pre-wrap leading-[20px]">*</p>
      </div>
      <div className="relative z-[1] flex h-[20px] w-[90.55px] shrink-0 flex-col justify-center font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2a40] not-italic">
        <p className="whitespace-pre-wrap leading-[20px]">{"קטגוריה ראשית "}</p>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative size-[21px] shrink-0" data-name="SVG">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 21 21"
      >
        <title>Interface icon</title>
        <g id="SVG">
          <path
            d="M6.3 8.4L10.5 12.6L14.7 8.4"
            id="Vector"
            stroke="var(--stroke-0, #6B7280)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.575"
          />
        </g>
      </svg>
    </div>
  );
}

function ImageFill1() {
  return (
    <div
      className="absolute top-0 left-0 flex h-[46px] w-[320px] flex-col content-stretch items-end justify-center overflow-clip py-[12.5px] pr-[9px] pl-[290px]"
      data-name="image fill"
    >
      <Svg1 />
    </div>
  );
}

function Container34() {
  return (
    <div
      className="absolute top-1/2 right-[17px] left-[17px] flex -translate-y-1/2 flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[69.23px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#1a2a40] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">שיווק ופרסום</p>
      </div>
    </div>
  );
}

function Options1() {
  return (
    <div
      className="relative h-[46px] w-full shrink-0 rounded-[8px] bg-[#f8f7f5]"
      data-name="Options"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[#e2e8f0] border-solid"
      />
      <ImageFill1 />
      <Container34 />
    </div>
  );
}

function Container33() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <Options1 />
      <div
        className="absolute top-[19.98px] left-[18px] h-[7.4px] w-[12px]"
        data-name="Icon"
      >
        <svg
          className="absolute inset-0 block"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 12 7.4"
        >
          <title>Interface icon</title>
          <path
            d={svgPaths.p1adfde00}
            fill="var(--fill-0, #94A3B8)"
            id="Icon"
          />
        </svg>
      </div>
    </div>
  );
}

function CategorySelection() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-start gap-[8px] self-stretch"
      data-name="Category Selection"
    >
      <Label1 />
      <Container33 />
    </div>
  );
}

function Container30() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-center gap-[32px]"
      data-name="Container"
    >
      <SubCategorySelection />
      <CategorySelection />
    </div>
  );
}

function Label2() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Label"
    >
      <div className="relative flex h-[20px] w-[119.59px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2a40] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          תגיות (בחירה מרובה)
        </p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-end overflow-clip pb-px"
      data-name="Container"
    >
      <div className="relative flex h-[18px] w-[71.19px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#6b7280] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[normal]">הוסף תגית...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-center overflow-clip pt-px"
      data-name="Input"
    >
      <Container37 />
    </div>
  );
}

function Container36() {
  return (
    <div
      className="relative flex min-h-px min-w-[120px] flex-[1_0_0] flex-col content-stretch items-start self-stretch"
      data-name="Container"
    >
      <Input />
    </div>
  );
}

function Button2() {
  return (
    <div className="relative size-[7px] shrink-0" data-name="Button">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7 7"
      >
        <title>Interface icon</title>
        <g id="Button">
          <path d={svgPaths.p233c0280} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[4px] self-stretch rounded-[9999px] bg-[#ff8c00] px-[12px] py-[6px]"
      data-name="Background"
    >
      <Button2 />
      <div className="relative flex h-[16px] w-[41.86px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">תל אביב</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="relative size-[7px] shrink-0" data-name="Button">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7 7"
      >
        <title>Interface icon</title>
        <g id="Button">
          <path d={svgPaths.p233c0280} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[3.99px] self-stretch rounded-[9999px] bg-[#ff8c00] px-[12px] py-[6px]"
      data-name="Background"
    >
      <Button3 />
      <div className="relative flex h-[16px] w-[54.63px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">ספק מועדף</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative size-[7px] shrink-0" data-name="Button">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7 7"
      >
        <title>Interface icon</title>
        <g id="Button">
          <path d={svgPaths.p233c0280} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background5() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[3.99px] self-stretch rounded-[9999px] bg-[#ff8c00] px-[12px] py-[6px]"
      data-name="Background"
    >
      <Button4 />
      <div className="relative flex h-[16px] w-[32.08px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">דיגיטל</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
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
    <div
      className="relative min-h-[100px] w-full shrink-0 rounded-[8px] bg-[#f8f7f5]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[#e2e8f0] border-solid"
      />
      <div className="relative flex min-h-[inherit] w-full flex-col content-stretch items-start px-[13px] pt-[13px] pb-[59px]">
        <Container35 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[4px] bg-[#f1f5f9] px-[9px] py-[3px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#e2e8f0] border-solid"
      />
      <div className="relative flex h-[16px] w-[33.42px] shrink-0 flex-col justify-center text-center font-['FreeSans:Regular',sans-serif] text-[#475569] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">+ דחוף</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[4px] bg-[#f1f5f9] px-[9px] py-[3px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#e2e8f0] border-solid"
      />
      <div className="relative flex h-[16px] w-[33.81px] shrink-0 flex-col justify-center text-center font-['FreeSans:Regular',sans-serif] text-[#475569] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">+ שנתי</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[4px] bg-[#f1f5f9] px-[9px] py-[3px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#e2e8f0] border-solid"
      />
      <div className="relative flex h-[16px] w-[33.16px] shrink-0 flex-col justify-center text-center font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal text-[#475569] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">+ B2B</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end self-stretch"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[34.94px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#94a3b8] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מומלץ:</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="size-full overflow-clip rounded-[inherit]">
        <div className="relative flex w-full content-stretch items-start gap-[8px] pb-[4px] pl-[458.67px]">
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
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[8px]"
      data-name="Tags Selection"
    >
      <Label2 />
      <BackgroundBorder1 />
      <Container38 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div
      className="relative isolate flex shrink-0 content-stretch items-start justify-end text-right text-[12px] text-[rgba(26,42,64,0.7)] leading-[0]"
      data-name="Paragraph"
    >
      <div className="relative z-[5] flex h-[16px] w-[37.59px] shrink-0 flex-col justify-center font-['FreeSans:Regular',sans-serif] not-italic">
        <p className="whitespace-pre-wrap leading-[16px]">{" לדילוג."}</p>
      </div>
      <div className="relative z-[4] flex h-[16px] w-[20.61px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold">
        <p className="whitespace-pre-wrap leading-[16px]">Esc</p>
      </div>
      <div className="relative z-[3] flex h-[16px] w-[99.78px] shrink-0 flex-col justify-center font-['FreeSans:Regular',sans-serif] not-italic">
        <p className="whitespace-pre-wrap leading-[16px]">
          {" לאישור ומעבר לבא, "}
        </p>
      </div>
      <div className="relative z-[2] flex h-[16px] w-[30.98px] shrink-0 flex-col justify-center font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold">
        <p className="whitespace-pre-wrap leading-[16px]">Enter</p>
      </div>
      <div className="relative z-[1] flex h-[16px] w-[124.83px] shrink-0 flex-col justify-center font-['FreeSans:Regular',sans-serif] not-italic">
        <p className="whitespace-pre-wrap leading-[16px]">
          {"טיפ למהירות: השתמש ב- "}
        </p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Container">
      <div className="relative flex h-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding">
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Container">
      <div className="relative flex h-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative h-[14px] w-[20px] shrink-0" data-name="Icon">
          <svg
            className="absolute inset-0 block"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 20 14"
          >
            <title>Interface icon</title>
            <path
              d={svgPaths.p2e758b40}
              fill="var(--fill-0, #FF8C00)"
              id="Icon"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px] bg-[rgba(255,140,0,0.05)]"
      data-name="Overlay+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[rgba(255,140,0,0.2)] border-solid"
      />
      <div className="relative flex w-full content-stretch items-start gap-[15.99px] py-[17px] pr-[17px] pl-[301.19px]">
        <Container40 />
        <Container41 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div
      className="relative w-full max-w-[672px] shrink-0"
      data-name="Container"
    >
      <div className="relative flex w-full max-w-[inherit] flex-col content-stretch items-start gap-[32px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container30 />
        <TagsSelection />
        <OverlayBorder />
      </div>
    </div>
  );
}

function SectionClassificationForm() {
  return (
    <div
      className="relative min-h-px w-full min-w-px flex-[1_0_0] rounded-[12px] bg-white"
      data-name="Section - Classification Form"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,140,0,0.1)] border-solid"
      />
      <div className="relative flex size-full flex-col content-stretch items-start px-[108px] py-[33px]">
        <div
          className="absolute inset-[0_0_-0.5px_0] rounded-[12px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
          data-name="Section - Classification Form:shadow"
        />
        <Container29 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative size-[16px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p300a1100} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center justify-center gap-[8px] rounded-[8px] bg-[#ff8c00] px-[40px] py-[12px]"
      data-name="Button"
    >
      <div
        className="absolute inset-[0_-0.01px_0_0] rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(255,140,0,0.2),0px_4px_6px_-4px_rgba(255,140,0,0.2)]"
        data-name="Button:shadow"
      />
      <Container43 />
      <div className="relative flex h-[24px] w-[110.52px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[16px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">אשר והמשך לבא</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding">
        <Button8 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative h-[12px] w-[19px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 19 12"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p2e7ab880}
            fill="var(--fill-0, #64748B)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[8px] px-[25px] py-[13px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[rgba(0,0,0,0)] border-solid"
      />
      <div className="relative flex h-[24px] w-[100.08px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#64748b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">דלג לספק הבא</p>
      </div>
      <Container45 />
    </div>
  );
}

function Container46() {
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
          <path d={svgPaths.pf86ae00} fill="var(--fill-0, #64748B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[8px] px-[25px] py-[13px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[rgba(0,0,0,0)] border-solid"
      />
      <div className="relative flex h-[24px] w-[87.78px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#64748b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">העבר לארכיון</p>
      </div>
      <Container46 />
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-start gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Button9 />
        <Button10 />
      </div>
    </div>
  );
}

function SectionActionToolbar() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Section - Action Toolbar"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,140,0,0.1)] border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between p-[25px]">
          <div
            className="absolute inset-0 rounded-[12px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
            data-name="Section - Action Toolbar:shadow"
          />
          <Container42 />
          <Container44 />
        </div>
      </div>
    </div>
  );
}

function MainWizardArea() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-start gap-[24px] self-stretch"
      data-name="Main Wizard Area"
    >
      <SectionContextCard />
      <SectionClassificationForm />
      <SectionActionToolbar />
    </div>
  );
}

function Container47() {
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
            d={svgPaths.p3f18d400}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding pl-[151.95px]">
          <div className="relative flex h-[20px] w-[112.03px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2a40] text-[14px] not-italic leading-[0]">
            <p className="whitespace-pre-wrap leading-[20px]">
              תור ספקים להסדרה
            </p>
          </div>
          <Container47 />
        </div>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[99.5px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2a40] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">{`אלפא שיווק בע"מ`}</p>
        </div>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[16px] w-[72.27px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#64748b] text-[12px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[16px]">מזהה: 987321</p>
        </div>
      </div>
    </div>
  );
}

function OverlayVerticalBorder() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px] bg-[rgba(255,140,0,0.1)]"
      data-name="Overlay+VerticalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-[#ff8c00] border-r-4 border-solid"
      />
      <div className="relative flex w-full flex-col content-stretch items-start py-[12px] pr-[16px] pl-[12px]">
        <Container49 />
        <Container50 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[85.88px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#1a2a40] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">בטא לוגיסטיקה</p>
        </div>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[16px] w-[70px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[16px]">מזהה: 112233</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px]"
      data-name="VerticalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-[rgba(0,0,0,0)] border-r-4 border-solid"
      />
      <div className="relative flex w-full flex-col content-stretch items-start py-[12px] pr-[16px] pl-[12px]">
        <Container51 />
        <Container52 />
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[105.27px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#1a2a40] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">גמא שירותי מחשוב</p>
        </div>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[16px] w-[76.31px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[16px]">מזהה: 445566</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder1() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px]"
      data-name="VerticalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-[rgba(0,0,0,0)] border-r-4 border-solid"
      />
      <div className="relative flex w-full flex-col content-stretch items-start py-[12px] pr-[16px] pl-[12px]">
        <Container53 />
        <Container54 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[115.41px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#1a2a40] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">
            דלתא בנייה ושיפוצים
          </p>
        </div>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[16px] w-[74.52px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[16px]">מזהה: 778899</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder2() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px]"
      data-name="VerticalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-[rgba(0,0,0,0)] border-r-4 border-solid"
      />
      <div className="relative flex w-full flex-col content-stretch items-start py-[12px] pr-[16px] pl-[12px]">
        <Container55 />
        <Container56 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
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
    <div className="relative w-full shrink-0 rounded-[4px]" data-name="Button">
      <div className="relative flex w-full content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding py-[8px]">
        <div className="relative flex h-[16px] w-[111.86px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[12px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[16px]">
            צפה בכל ה-55 שנותרו
          </p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,140,0,0.1)] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex w-full flex-col content-stretch items-start gap-[16px] p-[17px]">
        <Heading2 />
        <Container48 />
        <Button11 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[105.27px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2a40] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">סטטיסטיקת עבודה</p>
        </div>
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
      <div className="relative flex h-[16px] w-[75.3px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2a40] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">12 ספקים/שעה</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[43.86px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">קצב סיווג</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-center justify-between"
      data-name="Container"
    >
      <Container59 />
      <Container60 />
    </div>
  );
}

function Container62() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[54.3px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#1a2a40] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">01:24:00</p>
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
      <div className="relative flex h-[16px] w-[69.5px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">זמן עבודה היום</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-center justify-between"
      data-name="Container"
    >
      <Container62 />
      <Container63 />
    </div>
  );
}

function Container57() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container58 />
        <Container61 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,140,0,0.1)] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex w-full flex-col content-stretch items-start gap-[8px] p-[17px]">
        <Heading3 />
        <Container57 />
      </div>
    </div>
  );
}

function AsideSidebarQueue() {
  return (
    <div
      className="relative flex w-[320px] shrink-0 flex-col content-stretch items-start gap-[16px] self-stretch"
      data-name="Aside - Sidebar: Queue"
    >
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
    </div>
  );
}

function Main() {
  return (
    <div
      className="relative z-[1] w-full max-w-[1280px] shrink-0"
      data-name="Main"
    >
      <div className="relative flex w-full max-w-[inherit] content-stretch items-start gap-[24px] p-[24px]">
        <MainWizardArea />
        <AsideSidebarQueue />
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div
      className="relative isolate flex size-full flex-col content-stretch items-start bg-[#f8f7f5]"
      data-name="אשף סיווג ספקים - עם תווית"
    >
      <BackgroundHorizontalBorder />
      <SuccessToastsAreaSimulated />
      <HeaderTopNavigationBar />
      <Main />
    </div>
  );
}
