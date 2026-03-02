import imgImageBorderShadow from "figma:asset/3e33ffb968ecb98f421cfb68a6d08fed3e8bf007.png";
import svgPaths from "./svg-0ge3ai9ebs";

function Container2() {
  return (
    <div className="relative size-[20px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p2816f2c0}
            fill="var(--fill-0, #181510)"
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
      className="relative flex size-[40px] shrink-0 content-stretch items-center justify-center rounded-[8px]"
      data-name="Button"
    >
      <Container2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="relative h-[20px] w-[16px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 20"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p164b49c0}
            fill="var(--fill-0, #181510)"
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
      className="relative flex size-[40px] shrink-0 content-stretch items-center justify-center rounded-[8px]"
      data-name="Button"
    >
      <Container3 />
      <div
        className="absolute top-[10px] left-[10px] size-[8px] rounded-[9999px] bg-[#ef4444]"
        data-name="Background+Border"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[9999px] border-2 border-white border-solid"
        />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative z-[2] shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-end overflow-clip pb-px"
      data-name="Container"
    >
      <div className="relative flex h-[18px] w-[198.06px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#6b7280] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[normal]">
          חיפוש פרויקטים, ספקים או לקוחות...
        </p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px] bg-[#f5f3f0]"
      data-name="Input"
    >
      <div className="flex size-full flex-row justify-center overflow-clip rounded-[inherit]">
        <div className="relative flex w-full content-stretch items-start justify-center pt-[9px] pr-[40px] pb-[8px] pl-[16px]">
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div
      className="absolute top-[11.11%] right-[12px] bottom-[11.11%] flex flex-col content-stretch items-start"
      data-name="Container"
    >
      <div className="relative size-[13.5px] shrink-0" data-name="Icon">
        <svg
          className="absolute inset-0 block"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 13.5 13.5"
        >
          <title>Decorative icon</title>
          <path
            d={svgPaths.p2500af80}
            fill="var(--fill-0, #8D785E)"
            id="Icon"
          />
        </svg>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div
      className="relative flex min-h-px min-w-px max-w-[448px] flex-[1_0_0] flex-col content-stretch items-start"
      data-name="Container"
    >
      <Input />
      <Container7 />
    </div>
  );
}

function Container4() {
  return (
    <div
      className="relative z-[1] min-h-px min-w-px flex-[1_0_0]"
      data-name="Container"
    >
      <div className="flex size-full flex-row items-center justify-center">
        <div className="relative flex w-full content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding pl-[420px]">
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function HeaderTopBar() {
  return (
    <div
      className="absolute top-0 right-0 left-0 isolate flex h-[64px] content-stretch items-center justify-between bg-white px-[32px] pb-px"
      data-name="Header - Top Bar"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e7e1da] border-b border-solid"
      />
      <Container1 />
      <Container4 />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] bg-[#ff8c00] px-[16px] py-[9px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      data-name="Button"
    >
      <div className="relative flex h-[20px] w-[59.81px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[14px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">הוספת ליד</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] bg-white px-[17px] py-[9px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[#e7e1da] border-solid"
      />
      <div className="relative flex h-[20px] w-[60.94px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">ייצוא דוחות</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-start gap-[8px]"
      data-name="Container"
    >
      <Button2 />
      <Button3 />
    </div>
  );
}

function Heading1() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 2"
    >
      <div className="relative flex h-[36px] w-[287.53px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[30px] not-italic leading-[0] tracking-[-0.75px]">
        <p className="whitespace-pre-wrap leading-[36px]">
          לוח בקרה - מפיק אירועים
        </p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[323.92px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          בוקר טוב, יוסי. הנה מה שקורה היום בפרויקטים שלך.
        </p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Heading1 />
      <Container10 />
    </div>
  );
}

function WelcomeSection() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-end justify-between"
      data-name="Welcome Section"
    >
      <Container8 />
      <Container9 />
    </div>
  );
}

function Background() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end rounded-[4px] bg-[#f5f3f0] px-[8px] py-[4px]"
      data-name="Background"
    >
      <div className="relative flex h-[16px] w-[21.06px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#8d785e] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">0%</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="relative h-[36px] w-[34px] shrink-0" data-name="Background">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 34 36"
      >
        <title>Decorative icon</title>
        <g id="Background">
          <rect fill="var(--fill-0, #FFF7ED)" height="36" rx="8" width="34" />
          <path
            d={svgPaths.p3a2432c0}
            fill="var(--fill-0, #EA580C)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start justify-between border-0 border-[transparent] border-solid bg-clip-padding">
        <Background />
        <Background1 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[83.47px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">אירועים קרובים</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative w-full shrink-0" data-name="Margin">
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding pt-[8px]">
        <Container12 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[36px] w-[18.97px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#181510] text-[30px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[36px]">8</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div
      className="relative min-h-px min-w-px flex-[1_0_0] self-stretch rounded-[12px] bg-white"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e7e1da] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex size-full flex-col content-stretch items-start gap-[8px] p-[25px]">
        <Container11 />
        <Margin />
        <Container13 />
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end rounded-[4px] bg-[#f0fdf4] px-[8px] py-[4px]"
      data-name="Background"
    >
      <div className="relative flex h-[16px] w-[33.81px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#078810] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">+10%</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="relative h-[37px] w-[38px] shrink-0" data-name="Background">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 38 37"
      >
        <title>Decorative icon</title>
        <g id="Background">
          <rect fill="var(--fill-0, #FAF5FF)" height="37" rx="8" width="38" />
          <path
            d={svgPaths.p3eaeb596}
            fill="var(--fill-0, #A855F7)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start justify-between border-0 border-[transparent] border-solid bg-clip-padding">
        <Background2 />
        <Background3 />
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
      <div className="relative flex h-[20px] w-[104.92px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">פרויקטים משוריינים</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative w-full shrink-0" data-name="Margin">
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding pt-[8px]">
        <Container15 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[36px] w-[36.88px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#181510] text-[30px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[36px]">28</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div
      className="relative min-h-px min-w-px flex-[1_0_0] self-stretch rounded-[12px] bg-white"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e7e1da] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex size-full flex-col content-stretch items-start gap-[8px] p-[25px]">
        <Container14 />
        <Margin1 />
        <Container16 />
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end rounded-[4px] bg-[#fef2f2] px-[8px] py-[4px]"
      data-name="Background"
    >
      <div className="relative flex h-[16px] w-[27.14px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#e71008] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">-5%</p>
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="relative h-[36px] w-[32px] shrink-0" data-name="Background">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 36"
      >
        <title>Decorative icon</title>
        <g id="Background">
          <rect fill="var(--fill-0, #EFF6FF)" height="36" rx="8" width="32" />
          <path
            d={svgPaths.p3fbfef00}
            fill="var(--fill-0, #3B82F6)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start justify-between border-0 border-[transparent] border-solid bg-clip-padding">
        <Background4 />
        <Background5 />
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
      <div className="relative flex h-[20px] w-[87.31px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">הצעות שנשלחו</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="relative w-full shrink-0" data-name="Margin">
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding pt-[8px]">
        <Container18 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[36px] w-[38.08px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#181510] text-[30px] leading-[0]">
          <p className="whitespace-pre-wrap leading-[36px]">45</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div
      className="relative min-h-px min-w-px flex-[1_0_0] self-stretch rounded-[12px] bg-white"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e7e1da] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex size-full flex-col content-stretch items-start gap-[8px] p-[25px]">
        <Container17 />
        <Margin2 />
        <Container19 />
      </div>
    </div>
  );
}

function Background6() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end rounded-[4px] bg-[#f0fdf4] px-[8px] py-[4px]"
      data-name="Background"
    >
      <div className="relative flex h-[16px] w-[32.7px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#078810] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">+15%</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="relative h-[32px] w-[38px] shrink-0" data-name="Overlay">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 38 32"
      >
        <title>Decorative icon</title>
        <g id="Overlay">
          <rect
            fill="var(--fill-0, #FF8C00)"
            fillOpacity="0.1"
            height="32"
            rx="8"
            width="38"
          />
          <path
            d={svgPaths.p17aca680}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start justify-between border-0 border-[transparent] border-solid bg-clip-padding">
        <Background6 />
        <Overlay />
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
      <div className="relative flex h-[20px] w-[73px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">לידים חדשים</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="relative w-full shrink-0" data-name="Margin">
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding pt-[8px]">
        <Container21 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div
          className="relative h-[22.71px] w-[27.593px] shrink-0"
          data-name="Icon"
        >
          <svg
            className="absolute inset-0 block"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 27.5925 22.71"
          >
            <title>Decorative icon</title>
            <path
              d={svgPaths.p2a21e880}
              fill="var(--fill-0, #181510)"
              id="Icon"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow3() {
  return (
    <div
      className="relative min-h-px min-w-px flex-[1_0_0] self-stretch rounded-[12px] bg-white"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e7e1da] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex size-full flex-col content-stretch items-start gap-[8px] p-[25px]">
        <Container20 />
        <Margin3 />
        <Container22 />
      </div>
    </div>
  );
}

function StatsGrid() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-center gap-[24px]"
      data-name="Stats Grid"
    >
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
      <BackgroundBorderShadow2 />
      <BackgroundBorderShadow3 />
    </div>
  );
}

function Heading2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[28px] w-[196.81px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[20px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">
          פרויקטים שדורשים טיפול
        </p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="relative h-[18px] w-[4px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 4 18"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p233ed800}
            fill="var(--fill-0, #EF4444)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[8px] pr-[4px] pl-[727.17px]">
          <Heading2 />
          <Container24 />
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative h-[16px] w-[4px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 4 16"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3caf0c80}
            fill="var(--fill-0, #8D785E)"
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
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] p-[8px]"
      data-name="Button"
    >
      <Container27 />
    </div>
  );
}

function Button5() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[4px] bg-[#ff8c00] px-[16px] py-[8px]"
      data-name="Button"
    >
      <div className="relative flex h-[16px] w-[60.14px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">עדכון תקציב</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[28px] w-[177.27px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[18px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">{`טיול חברה - הייטק בע"מ`}</p>
      </div>
    </div>
  );
}

function Background7() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end rounded-[9999px] bg-[#fef2f2] px-[8px] py-[2px]"
      data-name="Background"
    >
      <div className="relative flex h-[16px] w-[26.5px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#dc2626] text-[12px] uppercase not-italic leading-[0] tracking-[0.6px]">
        <p className="whitespace-pre-wrap leading-[16px]">דחוף</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="relative h-[9.333px] w-[12.833px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 12.8333 9.33333"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p35624880}
            fill="var(--fill-0, #8D785E)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container31() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[4px]"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[68.17px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מחיר בהערכה</p>
      </div>
      <Container32 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[16px] pl-[32.58px]">
          <Background7 />
          <Container31 />
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Heading3 />
      <Container30 />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative size-[18px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path d={svgPaths.p9250360} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background8() {
  return (
    <div
      className="relative flex size-[48px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#f5f3f0]"
      data-name="Background"
    >
      <Container33 />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[20px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container29 />
        <Background8 />
      </div>
    </div>
  );
}

function Task() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px] bg-white"
      data-name="Task 1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-[#ef4444] border-t border-r-4 border-b border-l border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between py-[21px] pr-[24px] pl-[21px]">
          <Container26 />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative h-[16px] w-[4px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 4 16"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3caf0c80}
            fill="var(--fill-0, #8D785E)"
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
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] p-[8px]"
      data-name="Button"
    >
      <Container35 />
    </div>
  );
}

function Button7() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[4px] bg-[#f5f3f0] px-[16px] py-[8px]"
      data-name="Button"
    >
      <div className="relative flex h-[16px] w-[47.59px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">בדוק ספק</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Button6 />
        <Button7 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[28px] w-[160.84px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[18px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">
          גיבוש צוות - גליל עליון
        </p>
      </div>
    </div>
  );
}

function Background9() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end rounded-[9999px] bg-[#fefce8] px-[8px] py-[2px]"
      data-name="Background"
    >
      <div className="relative flex h-[16px] w-[72.95px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#a16207] text-[12px] uppercase not-italic leading-[0] tracking-[0.6px]">
        <p className="whitespace-pre-wrap leading-[16px]">ממתין לאימות</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div
      className="relative h-[11.375px] w-[11.958px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.9583 11.375"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p222001c0}
            fill="var(--fill-0, #8D785E)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container39() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[3.99px]"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[73.72px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">ספק לא מאומת</p>
      </div>
      <Container40 />
    </div>
  );
}

function Container38() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-center gap-[16.01px]"
      data-name="Container"
    >
      <Background9 />
      <Container39 />
    </div>
  );
}

function Container37() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Heading4 />
      <Container38 />
    </div>
  );
}

function Container41() {
  return (
    <div className="relative h-[12px] w-[22px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 22 12"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p107da600}
            fill="var(--fill-0, #8D785E)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Background10() {
  return (
    <div
      className="relative flex size-[48px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#f5f3f0]"
      data-name="Background"
    >
      <Container41 />
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[20px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container37 />
        <Background10 />
      </div>
    </div>
  );
}

function Task1() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px] bg-white"
      data-name="Task 2"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-[#eab308] border-t border-r-4 border-b border-l border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between py-[21px] pr-[24px] pl-[21px]">
          <Container34 />
          <Container36 />
        </div>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative h-[16px] w-[4px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 4 16"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3caf0c80}
            fill="var(--fill-0, #8D785E)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] p-[8px]"
      data-name="Button"
    >
      <Container43 />
    </div>
  );
}

function Button9() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[4px] bg-[#ff8c00] px-[16px] py-[8px]"
      data-name="Button"
    >
      <div className="relative flex h-[16px] w-[68.28px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[12px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">העלאת מסמך</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Button8 />
        <Button9 />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[28px] w-[130.25px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[18px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">נופש שנתי - אילת</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div
      className="relative h-[11.667px] w-[9.333px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 9.33333 11.6667"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path d={svgPaths.p1286780} fill="var(--fill-0, #DC2626)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container47() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[3.99px]"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[98.91px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#dc2626] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מסמך ביטוח פג תוקף</p>
      </div>
      <Container48 />
    </div>
  );
}

function Container46() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center pl-[13.33px]">
          <Container47 />
        </div>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Heading5 />
      <Container46 />
    </div>
  );
}

function Container49() {
  return (
    <div
      className="relative h-[18.025px] w-[18px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18.025"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p16b8d100}
            fill="var(--fill-0, #8D785E)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Background11() {
  return (
    <div
      className="relative flex size-[48px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#f5f3f0]"
      data-name="Background"
    >
      <Container49 />
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[20px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container45 />
        <Background11 />
      </div>
    </div>
  );
}

function Task2() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px] bg-white"
      data-name="Task 3"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-[#ef4444] border-t border-r-4 border-b border-l border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between py-[21px] pr-[24px] pl-[21px]">
          <Container42 />
          <Container44 />
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[16px]"
      data-name="Container"
    >
      <Task />
      <Task1 />
      <Task2 />
    </div>
  );
}

function UrgentTasksSection() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[16px]"
      data-name="Urgent Tasks Section"
    >
      <Container23 />
      <Container25 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="flex size-full flex-col items-end">
        <div className="relative flex w-full flex-col content-stretch items-end px-[4px]">
          <div className="relative flex h-[28px] w-[121.09px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[20px] not-italic leading-[0]">
            <p className="whitespace-pre-wrap leading-[28px]">פעילות אחרונה</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[86.56px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">תשלום התקבל</p>
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
      <div className="relative flex h-[16px] w-[129.84px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#8d785e] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">
          חברת סולארו - 45,000 ₪
        </p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end pt-[4px]"
      data-name="Container"
    >
      <div className="relative flex h-[15px] w-[39.02px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[10px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[15px]">לפני שעה</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start self-stretch"
      data-name="Container"
    >
      <Container53 />
      <Container54 />
      <Container55 />
    </div>
  );
}

function Container56() {
  return (
    <div className="relative size-[15px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path d={svgPaths.p1041200} fill="var(--fill-0, #16A34A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background12() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[9999px] bg-[#f0fdf4]"
      data-name="Background"
    >
      <Container56 />
    </div>
  );
}

function Container51() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start gap-[11.99px] border-0 border-[transparent] border-solid bg-clip-padding pr-[0.01px] pl-[74.81px]">
        <Container52 />
        <div
          className="absolute top-[32px] right-[15.01px] bottom-0 w-[2px] bg-[#f5f3f0]"
          data-name="Vertical Divider"
        />
        <Background12 />
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[120.97px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">הודעה חדשה מהספק</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[169.52px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">{`מלון דן - "אישרנו את כמות החדרים"`}</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end pt-[4px]"
      data-name="Container"
    >
      <div className="relative flex h-[15px] w-[49.89px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[10px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[15px]">לפני שעתיים</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start self-stretch"
      data-name="Container"
    >
      <Container59 />
      <Container60 />
      <Container61 />
    </div>
  );
}

function Container62() {
  return (
    <div className="relative size-[15px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path d={svgPaths.pd8b76a0} fill="var(--fill-0, #2563EB)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background13() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[9999px] bg-[#eff6ff]"
      data-name="Background"
    >
      <Container62 />
    </div>
  );
}

function Container57() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start gap-[11.99px] border-0 border-[transparent] border-solid bg-clip-padding pr-[0.01px] pl-[35.14px]">
        <Container58 />
        <div
          className="absolute top-[32px] right-[15.01px] bottom-0 w-[2px] bg-[#f5f3f0]"
          data-name="Vertical Divider"
        />
        <Background13 />
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
      <div className="relative flex h-[20px] w-[55.98px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">{`עדכון לו"ז`}</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[155.41px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">{`פרויקט גיבוש דרום - שונה ליום ד'`}</p>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end pt-[4px]"
      data-name="Container"
    >
      <div className="relative flex h-[15px] w-[27.61px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[10px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[15px]">אתמול</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start self-stretch"
      data-name="Container"
    >
      <Container65 />
      <Container66 />
      <Container67 />
    </div>
  );
}

function Container68() {
  return (
    <div className="relative size-[13.5px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13.5 13.5"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p10054d00}
            fill="var(--fill-0, #EA580C)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Background14() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[9999px] bg-[#fff7ed]"
      data-name="Background"
    >
      <Container68 />
    </div>
  );
}

function Container63() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start gap-[11.99px] border-0 border-[transparent] border-solid bg-clip-padding pr-[0.01px] pl-[49.25px]">
        <Container64 />
        <Background14 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow4() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e7e1da] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex w-full flex-col content-stretch items-start gap-[24px] p-[25px]">
        <Container51 />
        <Container57 />
        <Container63 />
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div
      className="relative flex w-[298.66px] shrink-0 flex-col content-stretch items-start gap-[16px] self-stretch"
      data-name="Container"
    >
      <Heading6 />
      <BackgroundBorderShadow4 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="flex size-full flex-col items-end">
        <div className="relative flex w-full flex-col content-stretch items-end px-[4px]">
          <div className="relative flex h-[28px] w-[126.61px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[20px] not-italic leading-[0]">
            <p className="whitespace-pre-wrap leading-[28px]">
              לוח זמנים שבועי
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="relative flex flex-col content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[16px] w-[68.94px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[12px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[16px]">צפה בכל היומן</p>
        </div>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[116.83px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold','Arimo:Bold',sans-serif] font-bold text-[#181510] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">14-20 במאי, 2024</p>
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center pr-[8px]"
      data-name="Margin"
    >
      <Container71 />
    </div>
  );
}

function MarginAlignCenter() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center self-stretch"
      data-name="Margin:align-center"
    >
      <Margin4 />
    </div>
  );
}

function Container72() {
  return (
    <div
      className="relative h-[7px] w-[4.317px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 4.31667 7"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p10965ac0}
            fill="var(--fill-0, #181510)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#f5f3f0]"
      data-name="Button"
    >
      <Container72 />
    </div>
  );
}

function Container73() {
  return (
    <div
      className="relative h-[7px] w-[4.317px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 4.31667 7"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p35022f90}
            fill="var(--fill-0, #181510)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#f5f3f0]"
      data-name="Button"
    >
      <Container73 />
    </div>
  );
}

function Container70() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-start gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
        <MarginAlignCenter />
        <Button11 />
        <Button12 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative w-full shrink-0" data-name="HorizontalBorder">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f5f3f0] border-b border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between border-0 border-[transparent] border-solid bg-clip-padding px-[16px] pt-[16px] pb-[17px]">
          <Button10 />
          <Container70 />
        </div>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="relative h-[30px] w-[27px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 27 30"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p37fa5680}
            fill="var(--fill-0, #E7E1DA)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container76() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[197.81px] shrink-0 flex-col justify-center text-center font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          אין אירועים נוספים להצגה בשבוע זה
        </p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center gap-[8px]"
      data-name="Container"
    >
      <Container75 />
      <Container76 />
    </div>
  );
}

function Background15() {
  return (
    <div
      className="relative h-[192px] w-full shrink-0 bg-[#fdfcfb]"
      data-name="Background"
    >
      <div className="relative flex size-full content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding">
        <Container74 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow5() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Background+Border+Shadow"
    >
      <div className="relative flex w-full flex-col content-stretch items-start overflow-clip rounded-[inherit] p-px">
        <HorizontalBorder />
        <Background15 />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e7e1da] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
    </div>
  );
}

function Container69() {
  return (
    <div
      className="relative flex w-[629.33px] shrink-0 flex-col content-stretch items-start gap-[16px] self-stretch"
      data-name="Container"
    >
      <Heading7 />
      <BackgroundBorderShadow5 />
    </div>
  );
}

function UpcomingEventsTeaser() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-center gap-[31.99px]"
      data-name="Upcoming Events Teaser"
    >
      <Container50 />
      <Container69 />
    </div>
  );
}

function DashboardContent() {
  return (
    <div
      className="absolute inset-[64px_0_-67px_0] flex flex-col content-stretch items-start gap-[32px] p-[32px]"
      data-name="Dashboard Content"
    >
      <WelcomeSection />
      <StatsGrid />
      <UrgentTasksSection />
      <UpcomingEventsTeaser />
    </div>
  );
}

function MainContentArea() {
  return (
    <div
      className="relative z-[2] h-full min-h-px min-w-px flex-[1_0_0] overflow-clip"
      data-name="Main Content Area"
    >
      <HeaderTopBar />
      <DashboardContent />
    </div>
  );
}

function Heading() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 1"
    >
      <div className="relative flex h-[18px] w-[81.38px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[#181510] text-[18px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[18px]">TravelPro</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[67px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מערכת הפקה</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding">
        <Heading />
        <Container78 />
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="relative size-[18px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path d={svgPaths.p36dc0c80} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background16() {
  return (
    <div
      className="relative size-[40px] shrink-0 rounded-[8px] bg-[#ff8c00]"
      data-name="Background"
    >
      <div className="relative flex size-full content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding">
        <Container79 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative w-full shrink-0" data-name="HorizontalBorder">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f5f3f0] border-b border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] border-0 border-[transparent] border-solid bg-clip-padding pt-[24px] pr-[24px] pb-[25px] pl-[97.63px]">
          <Container77 />
          <Background16 />
        </div>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[46.52px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">דשבורד</p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="relative size-[18px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p20793584}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Link() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px] bg-[rgba(255,140,0,0.1)]"
      data-name="Link"
    >
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] py-[10px] pr-[12px] pl-[128.47px]">
          <Container80 />
          <Container81 />
        </div>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[49.91px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">פרויקטים</p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="relative h-[19px] w-[20px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 19"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p1230f680}
            fill="var(--fill-0, #181510)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative w-full shrink-0 rounded-[8px]" data-name="Link">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] py-[10px] pr-[12px] pl-[125.08px]">
          <Container82 />
          <Container83 />
        </div>
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[60.94px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">בנק ספקים</p>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="relative h-[12px] w-[24px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 12"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path d={svgPaths.p5df3d80} fill="var(--fill-0, #181510)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative w-full shrink-0 rounded-[8px]" data-name="Link">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] py-[10px] pr-[12px] pl-[114.05px]">
          <Container84 />
          <Container85 />
        </div>
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[17.44px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">יומן</p>
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="relative h-[20px] w-[18px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 20"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p2a946800}
            fill="var(--fill-0, #181510)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative w-full shrink-0 rounded-[8px]" data-name="Link">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] py-[10px] pr-[12px] pl-[157.55px]">
          <Container86 />
          <Container87 />
        </div>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[43.86px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">הגדרות</p>
      </div>
    </div>
  );
}

function Container89() {
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
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3cdadd00}
            fill="var(--fill-0, #181510)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative w-full shrink-0 rounded-[8px]" data-name="Link">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] border-0 border-[transparent] border-solid bg-clip-padding py-[10px] pr-[12px] pl-[131.13px]">
          <Container88 />
          <Container89 />
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start pt-[17px]"
      data-name="HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f5f3f0] border-t border-solid"
      />
      <Link4 />
    </div>
  );
}

function Margin5() {
  return (
    <div
      className="relative flex min-h-[61px] w-full min-w-px flex-[1_0_0] flex-col content-stretch items-start justify-end pt-[517px]"
      data-name="Margin"
    >
      <HorizontalBorder2 />
    </div>
  );
}

function Nav() {
  return (
    <div
      className="relative min-h-px w-full min-w-px flex-[1_0_0]"
      data-name="Nav"
    >
      <div className="size-full overflow-clip rounded-[inherit]">
        <div className="relative flex size-full flex-col content-stretch items-start gap-[4px] border-0 border-[transparent] border-solid bg-clip-padding p-[16px]">
          <Link />
          <Link1 />
          <Link2 />
          <Link3 />
          <Margin5 />
        </div>
      </div>
    </div>
  );
}

function Container92() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[38.94px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">יוסי כהן</p>
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[51.94px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מפיק ראשי</p>
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <Container92 />
      <Container93 />
    </div>
  );
}

function Container90() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding pl-[119.06px]">
          <Container91 />
          <div
            className="relative size-[40px] shrink-0 rounded-[9999px] bg-size-[36px_36px] bg-top-left"
            data-name="Image+Border+Shadow"
            style={{ backgroundImage: `url('${imgImageBorderShadow}')` }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[9999px] border-2 border-white border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[78.66px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[16px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">פרויקט חדש</p>
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="relative size-[8.167px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 8.16667 8.16667"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path d={svgPaths.p10ad69c0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px] bg-[#ff8c00] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      data-name="Button"
    >
      <div className="relative flex w-full content-stretch items-center justify-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding py-[10px]">
        <Container94 />
        <Container95 />
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div
      className="relative w-full shrink-0 bg-[#fcfbf9]"
      data-name="Background+HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f5f3f0] border-t border-solid"
      />
      <div className="relative flex w-full flex-col content-stretch items-start gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding px-[16px] pt-[17px] pb-[16px]">
        <Container90 />
        <Button13 />
      </div>
    </div>
  );
}

function AsideSidebarNavigation() {
  return (
    <div
      className="relative z-[1] flex h-full w-[256px] shrink-0 flex-col content-stretch items-start bg-white pl-px"
      data-name="Aside - Sidebar Navigation"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e7e1da] border-l border-solid"
      />
      <HorizontalBorder1 />
      <Nav />
      <BackgroundHorizontalBorder />
    </div>
  );
}

function Container() {
  return (
    <div
      className="relative isolate flex h-[1024px] w-full shrink-0 content-stretch items-start overflow-clip"
      data-name="Container"
    >
      <MainContentArea />
      <AsideSidebarNavigation />
    </div>
  );
}

export default function Body() {
  return (
    <div
      className="relative flex size-full flex-col content-stretch items-start bg-[#f8f7f5]"
      data-name="Body"
    >
      <Container />
    </div>
  );
}
