import svgPaths from "./svg-0ge3ai9ebs";
import imgImageBorderShadow from "figma:asset/3e33ffb968ecb98f421cfb68a6d08fed3e8bf007.png";

function Container2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p2816f2c0} fill="var(--fill-0, #181510)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="Button">
      <Container2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p164b49c0} fill="var(--fill-0, #181510)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="Button">
      <Container3 />
      <div className="absolute bg-[#ef4444] left-[10px] rounded-[9999px] size-[8px] top-[10px]" data-name="Background+Border">
        <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 z-[2]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-end min-h-px min-w-px overflow-clip pb-px relative" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[18px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-right w-[198.06px]">
        <p className="leading-[normal] whitespace-pre-wrap">חיפוש פרויקטים, ספקים או לקוחות...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f5f3f0] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[8px] pl-[16px] pr-[40px] pt-[9px] relative w-full">
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bottom-[11.11%] content-stretch flex flex-col items-start right-[12px] top-[11.11%]" data-name="Container">
      <div className="relative shrink-0 size-[13.5px]" data-name="Icon">
        <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
          <path d={svgPaths.p2500af80} fill="var(--fill-0, #8D785E)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start max-w-[448px] min-h-px min-w-px relative" data-name="Container">
      <Input />
      <Container7 />
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative z-[1]" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-[420px] relative w-full">
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function HeaderTopBar() {
  return (
    <div className="absolute bg-white content-stretch flex h-[64px] isolate items-center justify-between left-0 pb-px px-[32px] right-0 top-0" data-name="Header - Top Bar">
      <div aria-hidden="true" className="absolute border-[#e7e1da] border-b border-solid inset-0 pointer-events-none" />
      <Container1 />
      <Container4 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex flex-col items-center justify-center px-[16px] py-[9px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[59.81px]">
        <p className="leading-[20px] whitespace-pre-wrap">הוספת ליד</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center px-[17px] py-[9px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-center w-[60.94px]">
        <p className="leading-[20px] whitespace-pre-wrap">ייצוא דוחות</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[36px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[30px] text-right tracking-[-0.75px] w-[287.53px]">
        <p className="leading-[36px] whitespace-pre-wrap">לוח בקרה - מפיק אירועים</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[16px] text-right w-[323.92px]">
        <p className="leading-[24px] whitespace-pre-wrap">בוקר טוב, יוסי. הנה מה שקורה היום בפרויקטים שלך.</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Heading1 />
      <Container10 />
    </div>
  );
}

function WelcomeSection() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Welcome Section">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#f5f3f0] content-stretch flex flex-col items-end px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[#8d785e] text-[12px] text-right w-[21.06px]">
        <p className="leading-[16px] whitespace-pre-wrap">0%</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="h-[36px] relative shrink-0 w-[34px]" data-name="Background">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 34 36">
        <g id="Background">
          <rect fill="var(--fill-0, #FFF7ED)" height="36" rx="8" width="34" />
          <path d={svgPaths.p3a2432c0} fill="var(--fill-0, #EA580C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative w-full">
        <Background />
        <Background1 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-right w-[83.47px]">
        <p className="leading-[20px] whitespace-pre-wrap">אירועים קרובים</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative w-full">
        <Container12 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[36px] justify-center leading-[0] relative shrink-0 text-[#181510] text-[30px] text-right w-[18.97px]">
          <p className="leading-[36px] whitespace-pre-wrap">8</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px] self-stretch" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[25px] relative size-full">
        <Container11 />
        <Margin />
        <Container13 />
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#f0fdf4] content-stretch flex flex-col items-end px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[#078810] text-[12px] text-right w-[33.81px]">
        <p className="leading-[16px] whitespace-pre-wrap">+10%</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="h-[37px] relative shrink-0 w-[38px]" data-name="Background">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 38 37">
        <g id="Background">
          <rect fill="var(--fill-0, #FAF5FF)" height="37" rx="8" width="38" />
          <path d={svgPaths.p3eaeb596} fill="var(--fill-0, #A855F7)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative w-full">
        <Background2 />
        <Background3 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-right w-[104.92px]">
        <p className="leading-[20px] whitespace-pre-wrap">פרויקטים משוריינים</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative w-full">
        <Container15 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[36px] justify-center leading-[0] relative shrink-0 text-[#181510] text-[30px] text-right w-[36.88px]">
          <p className="leading-[36px] whitespace-pre-wrap">28</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px] self-stretch" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[25px] relative size-full">
        <Container14 />
        <Margin1 />
        <Container16 />
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#fef2f2] content-stretch flex flex-col items-end px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[#e71008] text-[12px] text-right w-[27.14px]">
        <p className="leading-[16px] whitespace-pre-wrap">-5%</p>
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="h-[36px] relative shrink-0 w-[32px]" data-name="Background">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 32 36">
        <g id="Background">
          <rect fill="var(--fill-0, #EFF6FF)" height="36" rx="8" width="32" />
          <path d={svgPaths.p3fbfef00} fill="var(--fill-0, #3B82F6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative w-full">
        <Background4 />
        <Background5 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-right w-[87.31px]">
        <p className="leading-[20px] whitespace-pre-wrap">הצעות שנשלחו</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative w-full">
        <Container18 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[36px] justify-center leading-[0] relative shrink-0 text-[#181510] text-[30px] text-right w-[38.08px]">
          <p className="leading-[36px] whitespace-pre-wrap">45</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px] self-stretch" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[25px] relative size-full">
        <Container17 />
        <Margin2 />
        <Container19 />
      </div>
    </div>
  );
}

function Background6() {
  return (
    <div className="bg-[#f0fdf4] content-stretch flex flex-col items-end px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[#078810] text-[12px] text-right w-[32.7px]">
        <p className="leading-[16px] whitespace-pre-wrap">+15%</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="h-[32px] relative shrink-0 w-[38px]" data-name="Overlay">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 38 32">
        <g id="Overlay">
          <rect fill="var(--fill-0, #FF8C00)" fillOpacity="0.1" height="32" rx="8" width="38" />
          <path d={svgPaths.p17aca680} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative w-full">
        <Background6 />
        <Overlay />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-right w-[73px]">
        <p className="leading-[20px] whitespace-pre-wrap">לידים חדשים</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative w-full">
        <Container21 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="h-[22.71px] relative shrink-0 w-[27.593px]" data-name="Icon">
          <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 27.5925 22.71">
            <path d={svgPaths.p2a21e880} fill="var(--fill-0, #181510)" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow3() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px] self-stretch" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[25px] relative size-full">
        <Container20 />
        <Margin3 />
        <Container22 />
      </div>
    </div>
  );
}

function StatsGrid() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Stats Grid">
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
      <BackgroundBorderShadow2 />
      <BackgroundBorderShadow3 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[20px] text-right w-[196.81px]">
        <p className="leading-[28px] whitespace-pre-wrap">פרויקטים שדורשים טיפול</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[18px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 4 18">
        <g id="Container">
          <path d={svgPaths.p233ed800} fill="var(--fill-0, #EF4444)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[727.17px] pr-[4px] relative w-full">
          <Heading2 />
          <Container24 />
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[16px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 4 16">
        <g id="Container">
          <path d={svgPaths.p3caf0c80} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container27 />
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white w-[60.14px]">
        <p className="leading-[16px] whitespace-pre-wrap">עדכון תקציב</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[18px] text-right w-[177.27px]">
        <p className="leading-[28px] whitespace-pre-wrap">{`טיול חברה - הייטק בע"מ`}</p>
      </div>
    </div>
  );
}

function Background7() {
  return (
    <div className="bg-[#fef2f2] content-stretch flex flex-col items-end px-[8px] py-[2px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#dc2626] text-[12px] text-right tracking-[0.6px] uppercase w-[26.5px]">
        <p className="leading-[16px] whitespace-pre-wrap">דחוף</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[9.333px] relative shrink-0 w-[12.833px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 9.33333">
        <g id="Container">
          <path d={svgPaths.p35624880} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-right w-[68.17px]">
        <p className="leading-[16px] whitespace-pre-wrap">מחיר בהערכה</p>
      </div>
      <Container32 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[32.58px] relative w-full">
          <Background7 />
          <Container31 />
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Heading3 />
      <Container30 />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p9250360} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background8() {
  return (
    <div className="bg-[#f5f3f0] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[48px]" data-name="Background">
      <Container33 />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] items-center relative">
        <Container29 />
        <Background8 />
      </div>
    </div>
  );
}

function Task() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Task 1">
      <div aria-hidden="true" className="absolute border-[#ef4444] border-b border-l border-r-4 border-solid border-t inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[21px] pr-[24px] py-[21px] relative w-full">
          <Container26 />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[16px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 4 16">
        <g id="Container">
          <path d={svgPaths.p3caf0c80} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container35 />
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#f5f3f0] content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[12px] text-center w-[47.59px]">
        <p className="leading-[16px] whitespace-pre-wrap">בדוק ספק</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
        <Button6 />
        <Button7 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[18px] text-right w-[160.84px]">
        <p className="leading-[28px] whitespace-pre-wrap">גיבוש צוות - גליל עליון</p>
      </div>
    </div>
  );
}

function Background9() {
  return (
    <div className="bg-[#fefce8] content-stretch flex flex-col items-end px-[8px] py-[2px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#a16207] text-[12px] text-right tracking-[0.6px] uppercase w-[72.95px]">
        <p className="leading-[16px] whitespace-pre-wrap">ממתין לאימות</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[11.375px] relative shrink-0 w-[11.958px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9583 11.375">
        <g id="Container">
          <path d={svgPaths.p222001c0} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex gap-[3.99px] items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-right w-[73.72px]">
        <p className="leading-[16px] whitespace-pre-wrap">ספק לא מאומת</p>
      </div>
      <Container40 />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex gap-[16.01px] items-center relative shrink-0 w-full" data-name="Container">
      <Background9 />
      <Container39 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Heading4 />
      <Container38 />
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[12px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 22 12">
        <g id="Container">
          <path d={svgPaths.p107da600} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background10() {
  return (
    <div className="bg-[#f5f3f0] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[48px]" data-name="Background">
      <Container41 />
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] items-center relative">
        <Container37 />
        <Background10 />
      </div>
    </div>
  );
}

function Task1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Task 2">
      <div aria-hidden="true" className="absolute border-[#eab308] border-b border-l border-r-4 border-solid border-t inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[21px] pr-[24px] py-[21px] relative w-full">
          <Container34 />
          <Container36 />
        </div>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[16px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 4 16">
        <g id="Container">
          <path d={svgPaths.p3caf0c80} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container43 />
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white w-[68.28px]">
        <p className="leading-[16px] whitespace-pre-wrap">העלאת מסמך</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
        <Button8 />
        <Button9 />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[18px] text-right w-[130.25px]">
        <p className="leading-[28px] whitespace-pre-wrap">נופש שנתי - אילת</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 11.6667">
        <g id="Container">
          <path d={svgPaths.p1286780} fill="var(--fill-0, #DC2626)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[3.99px] items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#dc2626] text-[12px] text-right w-[98.91px]">
        <p className="leading-[16px] whitespace-pre-wrap">מסמך ביטוח פג תוקף</p>
      </div>
      <Container48 />
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[13.33px] relative w-full">
          <Container47 />
        </div>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Heading5 />
      <Container46 />
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[18.025px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18.025">
        <g id="Container">
          <path d={svgPaths.p16b8d100} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background11() {
  return (
    <div className="bg-[#f5f3f0] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[48px]" data-name="Background">
      <Container49 />
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] items-center relative">
        <Container45 />
        <Background11 />
      </div>
    </div>
  );
}

function Task2() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Task 3">
      <div aria-hidden="true" className="absolute border-[#ef4444] border-b border-l border-r-4 border-solid border-t inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[21px] pr-[24px] py-[21px] relative w-full">
          <Container42 />
          <Container44 />
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Task />
      <Task1 />
      <Task2 />
    </div>
  );
}

function UrgentTasksSection() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Urgent Tasks Section">
      <Container23 />
      <Container25 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end px-[4px] relative w-full">
          <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[20px] text-right w-[121.09px]">
            <p className="leading-[28px] whitespace-pre-wrap">פעילות אחרונה</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[86.56px]">
        <p className="leading-[20px] whitespace-pre-wrap">תשלום התקבל</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#8d785e] text-[12px] text-right w-[129.84px]">
        <p className="leading-[16px] whitespace-pre-wrap">חברת סולארו - 45,000 ₪</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-end pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[10px] text-right w-[39.02px]">
        <p className="leading-[15px] whitespace-pre-wrap">לפני שעה</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <Container53 />
      <Container54 />
      <Container55 />
    </div>
  );
}

function Container56() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p1041200} fill="var(--fill-0, #16A34A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background12() {
  return (
    <div className="bg-[#f0fdf4] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background">
      <Container56 />
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.99px] items-start pl-[74.81px] pr-[0.01px] relative w-full">
        <Container52 />
        <div className="absolute bg-[#f5f3f0] bottom-0 right-[15.01px] top-[32px] w-[2px]" data-name="Vertical Divider" />
        <Background12 />
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[120.97px]">
        <p className="leading-[20px] whitespace-pre-wrap">הודעה חדשה מהספק</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-right w-[169.52px]">
        <p className="leading-[16px] whitespace-pre-wrap">{`מלון דן - "אישרנו את כמות החדרים"`}</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-end pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[10px] text-right w-[49.89px]">
        <p className="leading-[15px] whitespace-pre-wrap">לפני שעתיים</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <Container59 />
      <Container60 />
      <Container61 />
    </div>
  );
}

function Container62() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.pd8b76a0} fill="var(--fill-0, #2563EB)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background13() {
  return (
    <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background">
      <Container62 />
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.99px] items-start pl-[35.14px] pr-[0.01px] relative w-full">
        <Container58 />
        <div className="absolute bg-[#f5f3f0] bottom-0 right-[15.01px] top-[32px] w-[2px]" data-name="Vertical Divider" />
        <Background13 />
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[55.98px]">
        <p className="leading-[20px] whitespace-pre-wrap">{`עדכון לו"ז`}</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-right w-[155.41px]">
        <p className="leading-[16px] whitespace-pre-wrap">{`פרויקט גיבוש דרום - שונה ליום ד'`}</p>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col items-end pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[10px] text-right w-[27.61px]">
        <p className="leading-[15px] whitespace-pre-wrap">אתמול</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <Container65 />
      <Container66 />
      <Container67 />
    </div>
  );
}

function Container68() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p10054d00} fill="var(--fill-0, #EA580C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background14() {
  return (
    <div className="bg-[#fff7ed] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background">
      <Container68 />
    </div>
  );
}

function Container63() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.99px] items-start pl-[49.25px] pr-[0.01px] relative w-full">
        <Container64 />
        <Background14 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow4() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[25px] relative w-full">
        <Container51 />
        <Container57 />
        <Container63 />
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative self-stretch shrink-0 w-[298.66px]" data-name="Container">
      <Heading6 />
      <BackgroundBorderShadow4 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end px-[4px] relative w-full">
          <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[20px] text-right w-[126.61px]">
            <p className="leading-[28px] whitespace-pre-wrap">לוח זמנים שבועי</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[12px] text-center w-[68.94px]">
          <p className="leading-[16px] whitespace-pre-wrap">צפה בכל היומן</p>
        </div>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold','Arimo:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#181510] text-[14px] text-right w-[116.83px]">
        <p className="leading-[20px] whitespace-pre-wrap">14-20 במאי, 2024</p>
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-center pr-[8px] relative shrink-0" data-name="Margin">
      <Container71 />
    </div>
  );
}

function MarginAlignCenter() {
  return (
    <div className="content-stretch flex items-center relative self-stretch shrink-0" data-name="Margin:align-center">
      <Margin4 />
    </div>
  );
}

function Container72() {
  return (
    <div className="h-[7px] relative shrink-0 w-[4.317px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31667 7">
        <g id="Container">
          <path d={svgPaths.p10965ac0} fill="var(--fill-0, #181510)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-[#f5f3f0] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <Container72 />
    </div>
  );
}

function Container73() {
  return (
    <div className="h-[7px] relative shrink-0 w-[4.317px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31667 7">
        <g id="Container">
          <path d={svgPaths.p35022f90} fill="var(--fill-0, #181510)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[#f5f3f0] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <Container73 />
    </div>
  );
}

function Container70() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative">
        <MarginAlignCenter />
        <Button11 />
        <Button12 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#f5f3f0] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[16px] relative w-full">
          <Button10 />
          <Container70 />
        </div>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="h-[30px] relative shrink-0 w-[27px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 27 30">
        <g id="Container">
          <path d={svgPaths.p37fa5680} fill="var(--fill-0, #E7E1DA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container76() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-center w-[197.81px]">
        <p className="leading-[20px] whitespace-pre-wrap">אין אירועים נוספים להצגה בשבוע זה</p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Container">
      <Container75 />
      <Container76 />
    </div>
  );
}

function Background15() {
  return (
    <div className="bg-[#fdfcfb] h-[192px] relative shrink-0 w-full" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container74 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow5() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <HorizontalBorder />
        <Background15 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative self-stretch shrink-0 w-[629.33px]" data-name="Container">
      <Heading7 />
      <BackgroundBorderShadow5 />
    </div>
  );
}

function UpcomingEventsTeaser() {
  return (
    <div className="content-stretch flex gap-[31.99px] items-start justify-center relative shrink-0 w-full" data-name="Upcoming Events Teaser">
      <Container50 />
      <Container69 />
    </div>
  );
}

function DashboardContent() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] inset-[64px_0_-67px_0] items-start p-[32px]" data-name="Dashboard Content">
      <WelcomeSection />
      <StatsGrid />
      <UrgentTasksSection />
      <UpcomingEventsTeaser />
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px overflow-clip relative z-[2]" data-name="Main Content Area">
      <HeaderTopBar />
      <DashboardContent />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[18px] justify-center leading-[0] relative shrink-0 text-[#181510] text-[18px] text-right w-[81.38px]">
        <p className="leading-[18px] whitespace-pre-wrap">TravelPro</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-right w-[67px]">
        <p className="leading-[16px] whitespace-pre-wrap">מערכת הפקה</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <Heading />
        <Container78 />
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p36dc0c80} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background16() {
  return (
    <div className="bg-[#ff8c00] relative rounded-[8px] shrink-0 size-[40px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container79 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#f5f3f0] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.99px] items-center pb-[25px] pl-[97.63px] pr-[24px] pt-[24px] relative w-full">
          <Container77 />
          <Background16 />
        </div>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-right w-[46.52px]">
        <p className="leading-[20px] whitespace-pre-wrap">דשבורד</p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p20793584} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link() {
  return (
    <div className="bg-[rgba(255,140,0,0.1)] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.99px] items-center pl-[128.47px] pr-[12px] py-[10px] relative w-full">
          <Container80 />
          <Container81 />
        </div>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[49.91px]">
        <p className="leading-[20px] whitespace-pre-wrap">פרויקטים</p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="h-[19px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 19">
        <g id="Container">
          <path d={svgPaths.p1230f680} fill="var(--fill-0, #181510)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.99px] items-center pl-[125.08px] pr-[12px] py-[10px] relative w-full">
          <Container82 />
          <Container83 />
        </div>
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[60.94px]">
        <p className="leading-[20px] whitespace-pre-wrap">בנק ספקים</p>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="h-[12px] relative shrink-0 w-[24px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 24 12">
        <g id="Container">
          <path d={svgPaths.p5df3d80} fill="var(--fill-0, #181510)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.99px] items-center pl-[114.05px] pr-[12px] py-[10px] relative w-full">
          <Container84 />
          <Container85 />
        </div>
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[17.44px]">
        <p className="leading-[20px] whitespace-pre-wrap">יומן</p>
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="h-[20px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
        <g id="Container">
          <path d={svgPaths.p2a946800} fill="var(--fill-0, #181510)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.99px] items-center pl-[157.55px] pr-[12px] py-[10px] relative w-full">
          <Container86 />
          <Container87 />
        </div>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[43.86px]">
        <p className="leading-[20px] whitespace-pre-wrap">הגדרות</p>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #181510)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.99px] items-center pl-[131.13px] pr-[12px] py-[10px] relative w-full">
          <Container88 />
          <Container89 />
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[17px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#f5f3f0] border-solid border-t inset-0 pointer-events-none" />
      <Link4 />
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-end min-h-[61px] min-w-px pt-[517px] relative w-full" data-name="Margin">
      <HorizontalBorder2 />
    </div>
  );
}

function Nav() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Nav">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start p-[16px] relative size-full">
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
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[38.94px]">
        <p className="leading-[20px] whitespace-pre-wrap">יוסי כהן</p>
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-right w-[51.94px]">
        <p className="leading-[16px] whitespace-pre-wrap">מפיק ראשי</p>
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container92 />
      <Container93 />
    </div>
  );
}

function Container90() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pl-[119.06px] relative w-full">
          <Container91 />
          <div className="bg-size-[36px_36px] bg-top-left relative rounded-[9999px] shrink-0 size-[40px]" data-name="Image+Border+Shadow" style={{ backgroundImage: `url('${imgImageBorderShadow}')` }}>
            <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[78.66px]">
        <p className="leading-[24px] whitespace-pre-wrap">פרויקט חדש</p>
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="relative shrink-0 size-[8.167px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16667 8.16667">
        <g id="Container">
          <path d={svgPaths.p10ad69c0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-[#ff8c00] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center py-[10px] relative w-full">
        <Container94 />
        <Container95 />
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-[#fcfbf9] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#f5f3f0] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start pb-[16px] pt-[17px] px-[16px] relative w-full">
        <Container90 />
        <Button13 />
      </div>
    </div>
  );
}

function AsideSidebarNavigation() {
  return (
    <div className="bg-white content-stretch flex flex-col h-full items-start pl-px relative shrink-0 w-[256px] z-[1]" data-name="Aside - Sidebar Navigation">
      <div aria-hidden="true" className="absolute border-[#e7e1da] border-l border-solid inset-0 pointer-events-none" />
      <HorizontalBorder1 />
      <Nav />
      <BackgroundHorizontalBorder />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[1024px] isolate items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <MainContentArea />
      <AsideSidebarNavigation />
    </div>
  );
}

export default function Body() {
  return (
    <div className="bg-[#f8f7f5] content-stretch flex flex-col items-start relative size-full" data-name="Body">
      <Container />
    </div>
  );
}