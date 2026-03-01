import svgPaths from "./svg-7spe5pfeic";
import imgImageBorder from "figma:asset/a3032e93fe352a25d17496d7dab23bccdcf7516a.png";

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p164b49c0} fill="var(--fill-0, #1A2B3C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative self-stretch shrink-0" data-name="Container">
      <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[40px]" data-name="Image+Border">
        <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
          <img alt="" className="absolute left-[5%] max-w-none size-[90%] top-[5%]" src={imgImageBorder} />
        </div>
        <div aria-hidden="true" className="absolute border-2 border-[rgba(255,140,0,0.2)] border-solid inset-0 rounded-[9999px]" />
      </div>
      <Container3 />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-right w-[47.39px]">
        <p className="leading-[20px] whitespace-pre-wrap">לוח שנה</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-end pb-[6px] relative shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#ff8c00] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-right w-[36.47px]">
        <p className="leading-[20px] whitespace-pre-wrap">ספקים</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-right w-[42.14px]">
        <p className="leading-[20px] whitespace-pre-wrap">אירועים</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-right w-[48.25px]">
        <p className="leading-[20px] whitespace-pre-wrap">דף הבית</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex gap-[36px] items-center relative self-stretch shrink-0" data-name="Nav">
      <Link />
      <Link1 />
      <Link2 />
      <Link3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative z-[2]" data-name="Container">
      <div className="flex flex-row justify-end size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[32px] items-start justify-end pr-[606.95px] relative w-full">
          <Container2 />
          <Nav />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[25px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[20px] text-right tracking-[-0.5px] w-[150.78px]">
        <p className="leading-[25px] whitespace-pre-wrap">מערכת ניהול ספקים</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Background">
      <Container5 />
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 z-[1]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Heading1 />
        <Background />
      </div>
    </div>
  );
}

function HeaderTopNavigationBar() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Header - Top Navigation Bar">
      <div aria-hidden="true" className="absolute border-[#e7e1da] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex isolate items-center justify-between pb-[13px] pt-[12px] px-[40px] relative w-full">
          <Container1 />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[9.333px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 9.33333">
        <g id="Container">
          <path d={svgPaths.p37c1fe00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-right text-white tracking-[1.2px] uppercase w-[210.95px]">
        <p className="leading-[16px] whitespace-pre-wrap">SCREEN LABEL: אשף ייבוא ספקים</p>
      </div>
      <Container7 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex items-center px-[16px] py-[6px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.35px_0_0] rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" data-name="Overlay+Shadow">
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_0px_white,inset_0px_0px_0px_1px_rgba(255,140,0,0.2)]" />
      </div>
      <Container6 />
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-center w-[154.73px]">
          <p className="leading-[20px] whitespace-pre-wrap">הורד תבנית לדוגמה (CSV)</p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p1c92c780} fill="var(--fill-0, #1A2B3C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[44px] items-center px-[25px] py-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container8 />
      <Container9 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[45px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[36px] text-right tracking-[-0.9px] w-[268.42px]">
        <p className="leading-[45px] whitespace-pre-wrap">ייבוא ספקים מאקסל</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[18px] text-right w-[345.31px]">
        <p className="leading-[28px] whitespace-pre-wrap">ייבאו את רשימת הספקים שלכם בקלות ובמהירות</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Container">
      <Heading />
      <Container11 />
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Header Section">
      <Button />
      <Container10 />
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p2940cd80} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[40px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border-2 border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container13 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-right w-[51.22px]">
        <p className="leading-[20px] whitespace-pre-wrap">סיום ייבוא</p>
      </div>
    </div>
  );
}

function Step4FinishPending() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center px-[16px] relative shrink-0" data-name="Step 4: Finish (Pending)">
      <BackgroundBorder />
      <Container14 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[15px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 22 15">
        <g id="Container">
          <path d={svgPaths.p3e801e80} fill="var(--fill-0, #8D785E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[40px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border-2 border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container15 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-right w-[84.27px]">
        <p className="leading-[20px] whitespace-pre-wrap">תצוגה מקדימה</p>
      </div>
    </div>
  );
}

function Step3PreviewPending() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center px-[16px] relative shrink-0" data-name="Step 3: Preview (Pending)">
      <BackgroundBorder1 />
      <Container16 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Container">
          <path d={svgPaths.p18964900} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="Background">
      <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0)] left-1/2 rounded-[9999px] shadow-[0px_0px_0px_4px_rgba(255,140,0,0.2),0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[40px] top-0" data-name="Overlay+Shadow" />
      <Container17 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-right w-[59.53px]">
        <p className="leading-[20px] whitespace-pre-wrap">מיפוי שדות</p>
      </div>
    </div>
  );
}

function Step2MappingActive() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center px-[16px] relative shrink-0" data-name="Step 2: Mapping (Active)">
      <Background2 />
      <Container18 />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[12.025px] relative shrink-0 w-[16.3px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16.3 12.025">
        <g id="Container">
          <path d={svgPaths.p2f7dfa00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#1a2b3c] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="Background">
      <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0)] left-1/2 rounded-[9999px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[40px] top-0" data-name="Overlay+Shadow" />
      <Container19 />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-right w-[73.69px]">
        <p className="leading-[20px] whitespace-pre-wrap">העלאת קובץ</p>
      </div>
    </div>
  );
}

function Step1UploadComplete() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center px-[16px] relative shrink-0" data-name="Step 1: Upload (Complete)">
      <Background3 />
      <Container20 />
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[0.02px] relative w-full">
          <div className="absolute bg-[#e7e1da] h-[2px] left-0 right-0 top-[20px]" data-name="Progress Line Background" />
          <Step4FinishPending />
          <Step3PreviewPending />
          <Step2MappingActive />
          <Step1UploadComplete />
        </div>
      </div>
    </div>
  );
}

function MultiStepProgressStepper() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Multi-step Progress Stepper">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col items-start pb-[25px] pt-[33px] px-[25px] relative w-full">
        <Container12 />
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(26,43,60,0.1)] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end px-[12px] py-[4px] relative">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[12px] text-right w-[82.66px]">
          <p className="leading-[16px] whitespace-pre-wrap">נמצאו 142 שורות</p>
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p254c2600} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[20px] text-right w-[228.11px]">
          <p className="leading-[28px] whitespace-pre-wrap">תצוגה מקדימה וזיהוי כפילויות</p>
        </div>
        <Container21 />
      </div>
    </div>
  );
}

function OverlayHorizontalBorder() {
  return (
    <div className="bg-[rgba(249,250,251,0.5)] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e7e1da] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[25px] pl-[24px] pr-[23.99px] pt-[24px] relative w-full">
          <Overlay />
          <Heading2 />
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="relative shrink-0 w-[209.36px] z-[4]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[16px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] w-[40.13px]">
          <p className="leading-[20px] whitespace-pre-wrap">פעולות</p>
        </div>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="relative shrink-0 w-[188.77px] z-[3]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end p-[16px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-right w-[37px]">
          <p className="leading-[20px] whitespace-pre-wrap">סטטוס</p>
        </div>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="relative shrink-0 w-[145.97px] z-[2]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end p-[16px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-right w-[45.66px]">
          <p className="leading-[20px] whitespace-pre-wrap">קטגוריה</p>
        </div>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="relative shrink-0 w-[211.25px] z-[1]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end p-[16px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-right w-[47.02px]">
          <p className="leading-[20px] whitespace-pre-wrap">שם ספק</p>
        </div>
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div className="bg-[#f8f7f5] content-stretch flex isolate items-start justify-center mb-[-1px] pb-px relative shrink-0 w-full" data-name="Header → Row">
      <div aria-hidden="true" className="absolute border-[#e7e1da] border-b border-solid inset-0 pointer-events-none" />
      <Cell />
      <Cell1 />
      <Cell2 />
      <Cell3 />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.pad10a80} fill="var(--fill-0, #1A2B3C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button">
      <Container22 />
    </div>
  );
}

function Data() {
  return (
    <div className="relative shrink-0 w-[209.36px] z-[4]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[16px] py-[16.5px] relative w-full">
        <Button1 />
      </div>
    </div>
  );
}

function Container23() {
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

function Data1() {
  return (
    <div className="relative shrink-0 w-[156.77px] z-[3]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pl-[110.89px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[14px] text-right w-[23.88px]">
          <p className="leading-[20px] whitespace-pre-wrap">תקין</p>
        </div>
        <Container23 />
      </div>
    </div>
  );
}

function Data2() {
  return (
    <div className="relative shrink-0 w-[145.97px] z-[2]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end px-[16px] py-[18.5px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[70.3px]">
          <p className="leading-[20px] whitespace-pre-wrap">אולמות וגנים</p>
        </div>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="relative shrink-0 w-[195.24px] z-[1]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end px-[16px] py-[18.5px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[95.42px]">
          <p className="leading-[20px] whitespace-pre-wrap">גן אירועים קיסריה</p>
        </div>
      </div>
    </div>
  );
}

function Row1Normal() {
  return (
    <div className="content-stretch flex gap-[16px] isolate items-center justify-center mb-[-1px] pb-px relative shrink-0 w-full" data-name="Row 1: Normal">
      <div aria-hidden="true" className="absolute border-[#f5f3f0] border-b border-solid inset-0 pointer-events-none" />
      <Data />
      <Data1 />
      <Data2 />
      <Data3 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center px-[13px] py-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-center w-[37.44px]">
        <p className="leading-[16px] whitespace-pre-wrap">התעלם</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center px-[13px] py-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ff8c00] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[12px] text-center w-[17.27px]">
        <p className="leading-[16px] whitespace-pre-wrap">מזג</p>
      </div>
    </div>
  );
}

function Data4() {
  return (
    <div className="relative shrink-0 w-[209.36px] z-[4]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start justify-end pl-[16px] pr-[78.65px] py-[16px] relative w-full">
        <Button2 />
        <Button3 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[14.25px] relative shrink-0 w-[16.5px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 14.25">
        <g id="Container">
          <path d={svgPaths.p10d9fd00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Data5() {
  return (
    <div className="relative shrink-0 w-[156.77px] z-[3]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pl-[56.47px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-right w-[78.3px]">
          <p className="leading-[20px] whitespace-pre-wrap">חשד לכפילות</p>
        </div>
        <Container24 />
      </div>
    </div>
  );
}

function Data6() {
  return (
    <div className="relative shrink-0 w-[145.97px] z-[2]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end px-[16px] py-[19.5px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[44.88px]">
          <p className="leading-[20px] whitespace-pre-wrap">קייטרינג</p>
        </div>
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="relative shrink-0 w-[195.24px] z-[1]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end px-[16px] py-[19.5px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[84.25px]">
          <p className="leading-[20px] whitespace-pre-wrap">קייטרינג טעמים</p>
        </div>
      </div>
    </div>
  );
}

function Row2DuplicateSuspected() {
  return (
    <div className="bg-[rgba(255,140,0,0.05)] content-stretch flex gap-[16px] isolate items-center justify-center mb-[-1px] pb-px relative shrink-0 w-full" data-name="Row 2: Duplicate Suspected">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Data4 />
      <Data5 />
      <Data6 />
      <Data7 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.pad10a80} fill="var(--fill-0, #1A2B3C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button">
      <Container25 />
    </div>
  );
}

function Data8() {
  return (
    <div className="relative shrink-0 w-[209.36px] z-[4]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[16px] py-[16.5px] relative w-full">
        <Button4 />
      </div>
    </div>
  );
}

function Container26() {
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

function Data9() {
  return (
    <div className="relative shrink-0 w-[156.77px] z-[3]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pl-[110.89px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#16a34a] text-[14px] text-right w-[23.88px]">
          <p className="leading-[20px] whitespace-pre-wrap">תקין</p>
        </div>
        <Container26 />
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="relative shrink-0 w-[145.97px] z-[2]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end px-[16px] py-[18.5px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[36.58px]">
          <p className="leading-[20px] whitespace-pre-wrap">מוזיקה</p>
        </div>
      </div>
    </div>
  );
}

function Data11() {
  return (
    <div className="relative shrink-0 w-[195.24px] z-[1]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end px-[16px] py-[18.5px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[72.91px]">
          <p className="leading-[20px] whitespace-pre-wrap">{`דיג'יי רועי כהן`}</p>
        </div>
      </div>
    </div>
  );
}

function Row3Normal() {
  return (
    <div className="content-stretch flex gap-[16px] isolate items-center justify-center mb-[-1px] pb-px relative shrink-0 w-full" data-name="Row 3: Normal">
      <div aria-hidden="true" className="absolute border-[#f5f3f0] border-b border-solid inset-0 pointer-events-none" />
      <Data8 />
      <Data9 />
      <Data10 />
      <Data11 />
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center px-[13px] py-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-center w-[37.44px]">
        <p className="leading-[16px] whitespace-pre-wrap">התעלם</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center px-[13px] py-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ff8c00] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[12px] text-center w-[17.27px]">
        <p className="leading-[16px] whitespace-pre-wrap">מזג</p>
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="relative shrink-0 w-[209.36px] z-[4]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start justify-end pl-[16px] pr-[78.65px] py-[16px] relative w-full">
        <Button5 />
        <Button6 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[14.25px] relative shrink-0 w-[16.5px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 14.25">
        <g id="Container">
          <path d={svgPaths.p10d9fd00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Data13() {
  return (
    <div className="relative shrink-0 w-[156.77px] z-[3]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pl-[56.47px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[14px] text-right w-[78.3px]">
          <p className="leading-[20px] whitespace-pre-wrap">חשד לכפילות</p>
        </div>
        <Container27 />
      </div>
    </div>
  );
}

function Data14() {
  return (
    <div className="relative shrink-0 w-[145.97px] z-[2]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end px-[16px] py-[19.5px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[31.16px]">
          <p className="leading-[20px] whitespace-pre-wrap">צילום</p>
        </div>
      </div>
    </div>
  );
}

function Data15() {
  return (
    <div className="relative shrink-0 w-[195.24px] z-[1]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end px-[16px] py-[19.5px] relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#181510] text-[14px] text-right w-[116.05px]">
          <p className="leading-[20px] whitespace-pre-wrap">{`סטודיו צילום "רגעים"`}</p>
        </div>
      </div>
    </div>
  );
}

function Row4DuplicateSuspected() {
  return (
    <div className="bg-[rgba(255,140,0,0.05)] content-stretch flex gap-[16px] isolate items-center justify-center mb-[-1px] pb-px relative shrink-0 w-full" data-name="Row 4: Duplicate Suspected">
      <div aria-hidden="true" className="absolute border-[rgba(255,140,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Data12 />
      <Data13 />
      <Data14 />
      <Data15 />
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-1px] pb-px relative shrink-0 w-full" data-name="Body">
      <Row1Normal />
      <Row2DuplicateSuspected />
      <Row3Normal />
      <Row4DuplicateSuspected />
    </div>
  );
}

function Table() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px relative rounded-[inherit] w-full">
        <HeaderRow />
        <Body />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[12px] text-right w-[122.98px]">
          <p className="leading-[16px] whitespace-pre-wrap">מציג 1-4 מתוך 142 שורות</p>
        </div>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[12px] relative shrink-0 w-[7.4px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 7.4 12">
        <g id="Container">
          <path d={svgPaths.p3ed0080} fill="var(--fill-0, #1A2B3C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container30 />
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center pb-[4.5px] pt-[3.5px] px-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#1a2b3c] text-[16px] text-center w-[9.75px]">
        <p className="leading-[24px] whitespace-pre-wrap">3</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center pb-[4.5px] pt-[3.5px] px-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#1a2b3c] text-[16px] text-center w-[9.61px]">
        <p className="leading-[24px] whitespace-pre-wrap">2</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex items-center justify-center pb-[4.5px] pt-[3.5px] px-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ff8c00] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[6.45px]">
        <p className="leading-[24px] whitespace-pre-wrap">1</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[12px] relative shrink-0 w-[7.4px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 7.4 12">
        <g id="Container">
          <path d={svgPaths.p28c84800} fill="var(--fill-0, #1A2B3C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container31 />
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative">
        <Button7 />
        <Button8 />
        <Button9 />
        <Button10 />
        <Button11 />
      </div>
    </div>
  );
}

function TableFooterPagination() {
  return (
    <div className="bg-[rgba(249,250,251,0.5)] relative shrink-0 w-full" data-name="Table Footer / Pagination">
      <div aria-hidden="true" className="absolute border-[#e7e1da] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[16px] pt-[17px] px-[16px] relative w-full">
          <Container28 />
          <Container29 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <OverlayHorizontalBorder />
        <Table />
        <TableFooterPagination />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p90f48c0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[143.27px]">
        <p className="leading-[24px] whitespace-pre-wrap">ייבא הכל (142 ספקים)</p>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[#ff8c00] content-stretch flex gap-[8px] items-center px-[40px] py-[14px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.01px_0_0] rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
      <Container33 />
      <Container34 />
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center px-[34px] py-[14px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#ff8c00] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff8c00] text-[16px] text-center w-[135.31px]">
        <p className="leading-[24px] whitespace-pre-wrap">דלג על כפילויות וייבא</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0" data-name="Container">
      <Button12 />
      <Button13 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[16px] text-center w-[130.95px]">
        <p className="leading-[24px] whitespace-pre-wrap">חזרה להעלאת קובץ</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p1a406200} fill="var(--fill-0, #1A2B3C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-[#f5f3f0] content-stretch flex gap-[8px] items-center px-[32px] py-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container35 />
      <Container36 />
    </div>
  );
}

function BottomActionBar() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Bottom Action Bar">
      <Container32 />
      <Button14 />
    </div>
  );
}

function RightColumnDataPreviewValidation() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative self-stretch shrink-0 w-[757.34px]" data-name="Right Column: Data Preview & Validation">
      <BackgroundBorderShadow />
      <BottomActionBar />
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[16px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 16">
        <g id="Container">
          <path d={svgPaths.p28ce3f00} fill="var(--fill-0, #FF8C00)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pl-[118.11px] relative w-full">
          <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[20px] text-right w-[162.53px]">
            <p className="leading-[28px] whitespace-pre-wrap">מיפוי שדות מהאקסל</p>
          </div>
          <Container37 />
        </div>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-right w-[276.84px]">
          <p className="leading-[20px] whitespace-pre-wrap">התאימו את עמודות האקסל לשדות המערכת שלנו</p>
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-right w-[65.78px]">
        <p className="leading-[20px] whitespace-pre-wrap">שם הספק *</p>
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
    <div className="absolute content-stretch flex flex-col h-[38px] items-end justify-center left-0 overflow-clip pl-[282.66px] pr-[9px] py-[8.5px] top-0 w-[312.66px]" data-name="image fill">
      <Svg />
    </div>
  );
}

function Container40() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-end left-[13px] overflow-clip right-[41px] top-1/2" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#181510] text-[14px] text-right w-[162.66px]">
        <p className="leading-[20px] whitespace-pre-wrap">Supplier_Name (עמודה A)</p>
      </div>
    </div>
  );
}

function Options() {
  return (
    <div className="bg-white h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="Options">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ImageFill />
      <Container40 />
    </div>
  );
}

function MappingRow() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Mapping Row 1">
      <Label />
      <Options />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-right w-[45.66px]">
        <p className="leading-[20px] whitespace-pre-wrap">קטגוריה</p>
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
    <div className="absolute content-stretch flex flex-col h-[38px] items-end justify-center left-0 overflow-clip pl-[282.66px] pr-[9px] py-[8.5px] top-0 w-[312.66px]" data-name="image fill">
      <Svg1 />
    </div>
  );
}

function Container41() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-end left-[13px] overflow-clip right-[41px] top-1/2" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#181510] text-[14px] text-right w-[122.81px]">
        <p className="leading-[20px] whitespace-pre-wrap">Category (עמודה B)</p>
      </div>
    </div>
  );
}

function Options1() {
  return (
    <div className="bg-white h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="Options">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ImageFill1 />
      <Container41 />
    </div>
  );
}

function MappingRow1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Mapping Row 2">
      <Label1 />
      <Options1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-right w-[30.81px]">
        <p className="leading-[20px] whitespace-pre-wrap">טלפון</p>
      </div>
    </div>
  );
}

function Svg2() {
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

function ImageFill2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[38px] items-end justify-center left-0 overflow-clip pl-[282.66px] pr-[9px] py-[8.5px] top-0 w-[312.66px]" data-name="image fill">
      <Svg2 />
    </div>
  );
}

function Container42() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-end left-[13px] overflow-clip right-[40.99px] top-1/2" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#181510] text-[14px] text-right w-[157.38px]">
        <p className="leading-[20px] whitespace-pre-wrap">Mobile_Phone (עמודה C)</p>
      </div>
    </div>
  );
}

function Options2() {
  return (
    <div className="bg-white h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="Options">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ImageFill2 />
      <Container42 />
    </div>
  );
}

function MappingRow2() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Mapping Row 3">
      <Label2 />
      <Options2 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2b3c] text-[14px] text-right w-[34.47px]">
        <p className="leading-[20px] whitespace-pre-wrap">אימייל</p>
      </div>
    </div>
  );
}

function Svg3() {
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

function ImageFill3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[38px] items-end justify-center left-0 overflow-clip pl-[282.66px] pr-[9px] py-[8.5px] top-0 w-[312.66px]" data-name="image fill">
      <Svg3 />
    </div>
  );
}

function Container43() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-end left-[13px] overflow-clip right-[41px] top-1/2" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#181510] text-[14px] text-right w-[159.59px]">
        <p className="leading-[20px] whitespace-pre-wrap">Email_Address (עמודה D)</p>
      </div>
    </div>
  );
}

function Options3() {
  return (
    <div className="bg-white h-[38px] relative rounded-[8px] shrink-0 w-full" data-name="Options">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ImageFill3 />
      <Container43 />
    </div>
  );
}

function MappingRow3() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Mapping Row 4">
      <Label3 />
      <Options3 />
    </div>
  );
}

function Container39() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start pb-[16px] pt-[8px] relative w-full">
        <MappingRow />
        <MappingRow1 />
        <MappingRow2 />
        <MappingRow3 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p128e1bc0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['FreeSans:Semi_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[128.56px]">
        <p className="leading-[24px] whitespace-pre-wrap">בצע בדיקת כפילויות</p>
      </div>
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-[#ff8c00] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center py-[12px] relative w-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[8px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
        <Container44 />
        <Container45 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e7e1da] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[25px] relative w-full">
        <Button15 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[#e7e1da] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative w-full">
        <Heading3 />
        <Container38 />
        <Container39 />
        <HorizontalBorder />
      </div>
    </div>
  );
}

function LeftColumnMappingSettings() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[362.66px]" data-name="Left Column: Mapping Settings">
      <BackgroundBorderShadow1 />
    </div>
  );
}

function MainContentAreaFieldMappingPreview() {
  return (
    <div className="content-stretch flex gap-[32px] items-start justify-center pt-[8px] relative shrink-0 w-full" data-name="Main Content Area: Field Mapping & Preview">
      <RightColumnDataPreviewValidation />
      <LeftColumnMappingSettings />
    </div>
  );
}

function Main() {
  return (
    <div className="max-w-[1200px] relative shrink-0 w-full" data-name="Main">
      <div className="flex flex-col items-end max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-end max-w-[inherit] px-[24px] py-[40px] relative w-full">
          <Background1 />
          <HeaderSection />
          <MultiStepProgressStepper />
          <MainContentAreaFieldMappingPreview />
        </div>
      </div>
    </div>
  );
}

function MainMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main:margin">
      <div className="content-stretch flex flex-col items-start px-[40px] relative w-full">
        <Main />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['FreeSans:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#8d785e] text-[14px] text-center w-[364.17px]">
          <p className="leading-[20px] whitespace-pre-wrap">© 2024 מערכת ניהול ספקים למפיקי אירועים. כל הזכויות שמורות.</p>
        </div>
      </div>
    </div>
  );
}

function FooterDivClassFlexFlexColItemsCenterGap6RoundedXlBorder2BorderDashedBorderE7E1DaBgWh() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] pt-[25px] relative shrink-0 w-full" data-name="Footer - div class='flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#e7e1da] bg-wh...">
      <div aria-hidden="true" className="absolute border-[#e7e1da] border-solid border-t inset-0 pointer-events-none" />
      <Container46 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start justify-between relative shrink-0 w-full" data-name="Container">
      <HeaderTopNavigationBar />
      <MainMargin />
      <FooterDivClassFlexFlexColItemsCenterGap6RoundedXlBorder2BorderDashedBorderE7E1DaBgWh />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#f8f7f5] content-stretch flex flex-col items-start justify-center relative size-full" data-name="אשף ייבוא ספקים - עם תווית">
      <Container />
    </div>
  );
}