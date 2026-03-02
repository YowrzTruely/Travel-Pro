import imgImageBorder from "figma:asset/a3032e93fe352a25d17496d7dab23bccdcf7516a.png";
import svgPaths from "./svg-7spe5pfeic";

function Container3() {
  return (
    <div className="relative h-[20px] w-[16px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 20"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p164b49c0}
            fill="var(--fill-0, #1A2B3C)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[16px] self-stretch"
      data-name="Container"
    >
      <div
        className="pointer-events-none relative size-[40px] shrink-0 rounded-[9999px]"
        data-name="Image+Border"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
          <img
            alt=""
            className="absolute top-[5%] left-[5%] size-[90%] max-w-none"
            height="600"
            src={imgImageBorder}
            width="800"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[9999px] border-2 border-[rgba(255,140,0,0.2)] border-solid"
        />
      </div>
      <Container3 />
    </div>
  );
}

function Link() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Link"
    >
      <div className="relative flex h-[20px] w-[47.39px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">לוח שנה</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end pb-[6px]"
      data-name="Link"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#ff8c00] border-b-2 border-solid"
      />
      <div className="relative flex h-[20px] w-[36.47px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">ספקים</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Link"
    >
      <div className="relative flex h-[20px] w-[42.14px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">אירועים</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Link"
    >
      <div className="relative flex h-[20px] w-[48.25px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">דף הבית</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[36px] self-stretch"
      data-name="Nav"
    >
      <Link />
      <Link1 />
      <Link2 />
      <Link3 />
    </div>
  );
}

function Container1() {
  return (
    <div
      className="relative z-[2] min-h-px min-w-px flex-[1_0_0]"
      data-name="Container"
    >
      <div className="flex size-full flex-row justify-end">
        <div className="relative flex w-full content-stretch items-start justify-end gap-[32px] border-0 border-[transparent] border-solid bg-clip-padding pr-[606.95px]">
          <Container2 />
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
      <div className="relative flex h-[25px] w-[150.78px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[20px] not-italic leading-[0] tracking-[-0.5px]">
        <p className="whitespace-pre-wrap leading-[25px]">מערכת ניהול ספקים</p>
      </div>
    </div>
  );
}

function Container5() {
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
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, white)" id="Icon" />
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
      <Container5 />
    </div>
  );
}

function Container4() {
  return (
    <div className="relative z-[1] shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Heading1 />
        <Background />
      </div>
    </div>
  );
}

function HeaderTopNavigationBar() {
  return (
    <div
      className="relative w-full shrink-0 bg-white"
      data-name="Header - Top Navigation Bar"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e7e1da] border-b border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative isolate flex w-full content-stretch items-center justify-between px-[40px] pt-[12px] pb-[13px]">
          <Container1 />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div
      className="relative h-[9.333px] w-[11.667px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11.6667 9.33333"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p37c1fe00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[6px]"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[210.95px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] text-[12px] text-white uppercase not-italic leading-[0] tracking-[1.2px]">
        <p className="whitespace-pre-wrap leading-[16px]">
          SCREEN LABEL: אשף ייבוא ספקים
        </p>
      </div>
      <Container7 />
    </div>
  );
}

function Background1() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center rounded-[9999px] bg-[#ff8c00] px-[16px] py-[6px]"
      data-name="Background"
    >
      <div
        className="absolute inset-[0_-0.35px_0_0] rounded-[9999px] bg-[rgba(255,255,255,0)] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        data-name="Overlay+Shadow"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_0px_white,inset_0px_0px_0px_1px_rgba(255,140,0,0.2)]" />
      </div>
      <Container6 />
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex flex-col content-stretch items-center border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[154.73px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">
            הורד תבנית לדוגמה (CSV)
          </p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
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
          <path
            d={svgPaths.p1c92c780}
            fill="var(--fill-0, #1A2B3C)"
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
      className="relative flex h-[44px] shrink-0 content-stretch items-center gap-[8px] rounded-[8px] bg-white px-[25px] py-px"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[#e7e1da] border-solid"
      />
      <Container8 />
      <Container9 />
    </div>
  );
}

function Heading() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 1"
    >
      <div className="relative flex h-[45px] w-[268.42px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[36px] not-italic leading-[0] tracking-[-0.9px]">
        <p className="whitespace-pre-wrap leading-[45px]">ייבוא ספקים מאקסל</p>
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
      <div className="relative flex h-[28px] w-[345.31px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[18px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">
          ייבאו את רשימת הספקים שלכם בקלות ובמהירות
        </p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[8px]"
      data-name="Container"
    >
      <Heading />
      <Container11 />
    </div>
  );
}

function HeaderSection() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-end justify-between"
      data-name="Header Section"
    >
      <Button />
      <Container10 />
    </div>
  );
}

function Container13() {
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
            d={svgPaths.p2940cd80}
            fill="var(--fill-0, #8D785E)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div
      className="relative flex size-[40px] shrink-0 content-stretch items-center justify-center rounded-[9999px] bg-white p-[2px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[9999px] border-2 border-[#e7e1da] border-solid"
      />
      <Container13 />
    </div>
  );
}

function Container14() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[51.22px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">סיום ייבוא</p>
      </div>
    </div>
  );
}

function Step4FinishPending() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center gap-[8px] bg-white px-[16px]"
      data-name="Step 4: Finish (Pending)"
    >
      <BackgroundBorder />
      <Container14 />
    </div>
  );
}

function Container15() {
  return (
    <div className="relative h-[15px] w-[22px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 22 15"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3e801e80}
            fill="var(--fill-0, #8D785E)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div
      className="relative flex size-[40px] shrink-0 content-stretch items-center justify-center rounded-[9999px] bg-white p-[2px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[9999px] border-2 border-[#e7e1da] border-solid"
      />
      <Container15 />
    </div>
  );
}

function Container16() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[84.27px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">תצוגה מקדימה</p>
      </div>
    </div>
  );
}

function Step3PreviewPending() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center gap-[8px] bg-white px-[16px]"
      data-name="Step 3: Preview (Pending)"
    >
      <BackgroundBorder1 />
      <Container16 />
    </div>
  );
}

function Container17() {
  return (
    <div className="relative h-[18px] w-[20px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 18"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p18964900} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div
      className="relative flex size-[40px] shrink-0 content-stretch items-center justify-center rounded-[9999px] bg-[#ff8c00]"
      data-name="Background"
    >
      <div
        className="absolute top-0 left-1/2 size-[40px] -translate-x-1/2 rounded-[9999px] bg-[rgba(255,255,255,0)] shadow-[0px_0px_0px_4px_rgba(255,140,0,0.2),0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <Container17 />
    </div>
  );
}

function Container18() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[59.53px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">מיפוי שדות</p>
      </div>
    </div>
  );
}

function Step2MappingActive() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center gap-[8px] bg-white px-[16px]"
      data-name="Step 2: Mapping (Active)"
    >
      <Background2 />
      <Container18 />
    </div>
  );
}

function Container19() {
  return (
    <div
      className="relative h-[12.025px] w-[16.3px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16.3 12.025"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p2f7dfa00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div
      className="relative flex size-[40px] shrink-0 content-stretch items-center justify-center rounded-[9999px] bg-[#1a2b3c]"
      data-name="Background"
    >
      <div
        className="absolute top-0 left-1/2 size-[40px] -translate-x-1/2 rounded-[9999px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <Container19 />
    </div>
  );
}

function Container20() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[73.69px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">העלאת קובץ</p>
      </div>
    </div>
  );
}

function Step1UploadComplete() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center gap-[8px] bg-white px-[16px]"
      data-name="Step 1: Upload (Complete)"
    >
      <Background3 />
      <Container20 />
    </div>
  );
}

function Container12() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between border-0 border-[transparent] border-solid bg-clip-padding pl-[0.02px]">
          <div
            className="absolute top-[20px] right-0 left-0 h-[2px] bg-[#e7e1da]"
            data-name="Progress Line Background"
          />
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
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-white"
      data-name="Multi-step Progress Stepper"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e7e1da] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex w-full flex-col content-stretch items-start px-[25px] pt-[33px] pb-[25px]">
        <Container12 />
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div
      className="relative shrink-0 rounded-[9999px] bg-[rgba(26,43,60,0.1)]"
      data-name="Overlay"
    >
      <div className="relative flex flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding px-[12px] py-[4px]">
        <div className="relative flex h-[16px] w-[82.66px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[12px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[16px]">נמצאו 142 שורות</p>
        </div>
      </div>
    </div>
  );
}

function Container21() {
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
          <path
            d={svgPaths.p254c2600}
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
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="relative flex content-stretch items-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[228.11px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[20px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">
            תצוגה מקדימה וזיהוי כפילויות
          </p>
        </div>
        <Container21 />
      </div>
    </div>
  );
}

function OverlayHorizontalBorder() {
  return (
    <div
      className="relative w-full shrink-0 bg-[rgba(249,250,251,0.5)]"
      data-name="Overlay+HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e7e1da] border-b border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between border-0 border-[transparent] border-solid bg-clip-padding pt-[24px] pr-[23.99px] pb-[25px] pl-[24px]">
          <Overlay />
          <Heading2 />
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="relative z-[4] w-[209.36px] shrink-0" data-name="Cell">
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding p-[16px]">
        <div className="relative flex h-[20px] w-[40.13px] shrink-0 flex-col justify-center font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">פעולות</p>
        </div>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="relative z-[3] w-[188.77px] shrink-0" data-name="Cell">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding p-[16px]">
        <div className="relative flex h-[20px] w-[37px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">סטטוס</p>
        </div>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="relative z-[2] w-[145.97px] shrink-0" data-name="Cell">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding p-[16px]">
        <div className="relative flex h-[20px] w-[45.66px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">קטגוריה</p>
        </div>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="relative z-[1] w-[211.25px] shrink-0" data-name="Cell">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding p-[16px]">
        <div className="relative flex h-[20px] w-[47.02px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">שם ספק</p>
        </div>
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div
      className="relative isolate mb-[-1px] flex w-full shrink-0 content-stretch items-start justify-center bg-[#f8f7f5] pb-px"
      data-name="Header → Row"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e7e1da] border-b border-solid"
      />
      <Cell />
      <Cell1 />
      <Cell2 />
      <Cell3 />
    </div>
  );
}

function Container22() {
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
          <path d={svgPaths.pad10a80} fill="var(--fill-0, #1A2B3C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center justify-center"
      data-name="Button"
    >
      <Container22 />
    </div>
  );
}

function Data() {
  return (
    <div className="relative z-[4] w-[209.36px] shrink-0" data-name="Data">
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding px-[16px] py-[16.5px]">
        <Button1 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative size-[15px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p1041200} fill="var(--fill-0, #16A34A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Data1() {
  return (
    <div className="relative z-[3] w-[156.77px] shrink-0" data-name="Data">
      <div className="relative flex w-full content-stretch items-center gap-[4px] border-0 border-[transparent] border-solid bg-clip-padding pl-[110.89px]">
        <div className="relative flex h-[20px] w-[23.88px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#16a34a] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">תקין</p>
        </div>
        <Container23 />
      </div>
    </div>
  );
}

function Data2() {
  return (
    <div className="relative z-[2] w-[145.97px] shrink-0" data-name="Data">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding px-[16px] py-[18.5px]">
        <div className="relative flex h-[20px] w-[70.3px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">אולמות וגנים</p>
        </div>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="relative z-[1] w-[195.24px] shrink-0" data-name="Data">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding px-[16px] py-[18.5px]">
        <div className="relative flex h-[20px] w-[95.42px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">
            גן אירועים קיסריה
          </p>
        </div>
      </div>
    </div>
  );
}

function Row1Normal() {
  return (
    <div
      className="relative isolate mb-[-1px] flex w-full shrink-0 content-stretch items-center justify-center gap-[16px] pb-px"
      data-name="Row 1: Normal"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f5f3f0] border-b border-solid"
      />
      <Data />
      <Data1 />
      <Data2 />
      <Data3 />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[4px] bg-white px-[13px] py-[5px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#e7e1da] border-solid"
      />
      <div className="relative flex h-[16px] w-[37.44px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">התעלם</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[4px] bg-white px-[13px] py-[5px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#ff8c00] border-solid"
      />
      <div className="relative flex h-[16px] w-[17.27px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מזג</p>
      </div>
    </div>
  );
}

function Data4() {
  return (
    <div className="relative z-[4] w-[209.36px] shrink-0" data-name="Data">
      <div className="relative flex w-full content-stretch items-start justify-end gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding py-[16px] pr-[78.65px] pl-[16px]">
        <Button2 />
        <Button3 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div
      className="relative h-[14.25px] w-[16.5px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16.5 14.25"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p10d9fd00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Data5() {
  return (
    <div className="relative z-[3] w-[156.77px] shrink-0" data-name="Data">
      <div className="relative flex w-full content-stretch items-center gap-[4px] border-0 border-[transparent] border-solid bg-clip-padding pl-[56.47px]">
        <div className="relative flex h-[20px] w-[78.3px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">חשד לכפילות</p>
        </div>
        <Container24 />
      </div>
    </div>
  );
}

function Data6() {
  return (
    <div className="relative z-[2] w-[145.97px] shrink-0" data-name="Data">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding px-[16px] py-[19.5px]">
        <div className="relative flex h-[20px] w-[44.88px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">קייטרינג</p>
        </div>
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="relative z-[1] w-[195.24px] shrink-0" data-name="Data">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding px-[16px] py-[19.5px]">
        <div className="relative flex h-[20px] w-[84.25px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">קייטרינג טעמים</p>
        </div>
      </div>
    </div>
  );
}

function Row2DuplicateSuspected() {
  return (
    <div
      className="relative isolate mb-[-1px] flex w-full shrink-0 content-stretch items-center justify-center gap-[16px] bg-[rgba(255,140,0,0.05)] pb-px"
      data-name="Row 2: Duplicate Suspected"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.1)] border-b border-solid"
      />
      <Data4 />
      <Data5 />
      <Data6 />
      <Data7 />
    </div>
  );
}

function Container25() {
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
          <path d={svgPaths.pad10a80} fill="var(--fill-0, #1A2B3C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center justify-center"
      data-name="Button"
    >
      <Container25 />
    </div>
  );
}

function Data8() {
  return (
    <div className="relative z-[4] w-[209.36px] shrink-0" data-name="Data">
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding px-[16px] py-[16.5px]">
        <Button4 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative size-[15px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p1041200} fill="var(--fill-0, #16A34A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Data9() {
  return (
    <div className="relative z-[3] w-[156.77px] shrink-0" data-name="Data">
      <div className="relative flex w-full content-stretch items-center gap-[4px] border-0 border-[transparent] border-solid bg-clip-padding pl-[110.89px]">
        <div className="relative flex h-[20px] w-[23.88px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#16a34a] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">תקין</p>
        </div>
        <Container26 />
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="relative z-[2] w-[145.97px] shrink-0" data-name="Data">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding px-[16px] py-[18.5px]">
        <div className="relative flex h-[20px] w-[36.58px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">מוזיקה</p>
        </div>
      </div>
    </div>
  );
}

function Data11() {
  return (
    <div className="relative z-[1] w-[195.24px] shrink-0" data-name="Data">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding px-[16px] py-[18.5px]">
        <div className="relative flex h-[20px] w-[72.91px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">{`דיג'יי רועי כהן`}</p>
        </div>
      </div>
    </div>
  );
}

function Row3Normal() {
  return (
    <div
      className="relative isolate mb-[-1px] flex w-full shrink-0 content-stretch items-center justify-center gap-[16px] pb-px"
      data-name="Row 3: Normal"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f5f3f0] border-b border-solid"
      />
      <Data8 />
      <Data9 />
      <Data10 />
      <Data11 />
    </div>
  );
}

function Button5() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[4px] bg-white px-[13px] py-[5px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#e7e1da] border-solid"
      />
      <div className="relative flex h-[16px] w-[37.44px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">התעלם</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[4px] bg-white px-[13px] py-[5px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#ff8c00] border-solid"
      />
      <div className="relative flex h-[16px] w-[17.27px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מזג</p>
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="relative z-[4] w-[209.36px] shrink-0" data-name="Data">
      <div className="relative flex w-full content-stretch items-start justify-end gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding py-[16px] pr-[78.65px] pl-[16px]">
        <Button5 />
        <Button6 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div
      className="relative h-[14.25px] w-[16.5px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16.5 14.25"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p10d9fd00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Data13() {
  return (
    <div className="relative z-[3] w-[156.77px] shrink-0" data-name="Data">
      <div className="relative flex w-full content-stretch items-center gap-[4px] border-0 border-[transparent] border-solid bg-clip-padding pl-[56.47px]">
        <div className="relative flex h-[20px] w-[78.3px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">חשד לכפילות</p>
        </div>
        <Container27 />
      </div>
    </div>
  );
}

function Data14() {
  return (
    <div className="relative z-[2] w-[145.97px] shrink-0" data-name="Data">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding px-[16px] py-[19.5px]">
        <div className="relative flex h-[20px] w-[31.16px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">צילום</p>
        </div>
      </div>
    </div>
  );
}

function Data15() {
  return (
    <div className="relative z-[1] w-[195.24px] shrink-0" data-name="Data">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding px-[16px] py-[19.5px]">
        <div className="relative flex h-[20px] w-[116.05px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#181510] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">{`סטודיו צילום "רגעים"`}</p>
        </div>
      </div>
    </div>
  );
}

function Row4DuplicateSuspected() {
  return (
    <div
      className="relative isolate mb-[-1px] flex w-full shrink-0 content-stretch items-center justify-center gap-[16px] bg-[rgba(255,140,0,0.05)] pb-px"
      data-name="Row 4: Duplicate Suspected"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[rgba(255,140,0,0.1)] border-b border-solid"
      />
      <Data12 />
      <Data13 />
      <Data14 />
      <Data15 />
    </div>
  );
}

function Body() {
  return (
    <div
      className="relative mb-[-1px] flex w-full shrink-0 flex-col content-stretch items-start pb-px"
      data-name="Body"
    >
      <Row1Normal />
      <Row2DuplicateSuspected />
      <Row3Normal />
      <Row4DuplicateSuspected />
    </div>
  );
}

function Table() {
  return (
    <div className="relative w-full shrink-0" data-name="Table">
      <div className="relative flex w-full flex-col content-stretch items-start overflow-clip rounded-[inherit] border-0 border-[transparent] border-solid bg-clip-padding pb-px">
        <HeaderRow />
        <Body />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[16px] w-[122.98px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[12px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[16px]">
            מציג 1-4 מתוך 142 שורות
          </p>
        </div>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative h-[12px] w-[7.4px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7.4 12"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p3ed0080} fill="var(--fill-0, #1A2B3C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[4px] bg-white p-px"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#e7e1da] border-solid"
      />
      <Container30 />
    </div>
  );
}

function Button8() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[4px] bg-white px-px pt-[3.5px] pb-[4.5px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#e7e1da] border-solid"
      />
      <div className="relative flex h-[24px] w-[9.75px] shrink-0 flex-col justify-center text-center font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal text-[#1a2b3c] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">3</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[4px] bg-white px-px pt-[3.5px] pb-[4.5px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#e7e1da] border-solid"
      />
      <div className="relative flex h-[24px] w-[9.61px] shrink-0 flex-col justify-center text-center font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal text-[#1a2b3c] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">2</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[4px] bg-[#ff8c00] px-px pt-[3.5px] pb-[4.5px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#ff8c00] border-solid"
      />
      <div className="relative flex h-[24px] w-[6.45px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[16px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">1</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="relative h-[12px] w-[7.4px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7.4 12"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p28c84800}
            fill="var(--fill-0, #1A2B3C)"
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
      className="relative flex size-[32px] shrink-0 content-stretch items-center justify-center rounded-[4px] bg-white p-px"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#e7e1da] border-solid"
      />
      <Container31 />
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-start gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
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
    <div
      className="relative w-full shrink-0 bg-[rgba(249,250,251,0.5)]"
      data-name="Table Footer / Pagination"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e7e1da] border-t border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between border-0 border-[transparent] border-solid bg-clip-padding px-[16px] pt-[17px] pb-[16px]">
          <Container28 />
          <Container29 />
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
      <div className="relative flex w-full flex-col content-stretch items-start overflow-clip rounded-[inherit] p-px">
        <OverlayHorizontalBorder />
        <Table />
        <TableFooterPagination />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e7e1da] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
    </div>
  );
}

function Container33() {
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
          <path d={svgPaths.p90f48c0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container34() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[143.27px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[16px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          ייבא הכל (142 ספקים)
        </p>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[8px] bg-[#ff8c00] px-[40px] py-[14px]"
      data-name="Button"
    >
      <div
        className="absolute inset-[0_-0.01px_0_0] rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        data-name="Button:shadow"
      />
      <Container33 />
      <Container34 />
    </div>
  );
}

function Button13() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] bg-white px-[34px] py-[14px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-[#ff8c00] border-solid"
      />
      <div className="relative flex h-[24px] w-[135.31px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ff8c00] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          דלג על כפילויות וייבא
        </p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-start gap-[16px]"
      data-name="Container"
    >
      <Button12 />
      <Button13 />
    </div>
  );
}

function Container35() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[130.95px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">חזרה להעלאת קובץ</p>
      </div>
    </div>
  );
}

function Container36() {
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
          <path
            d={svgPaths.p1a406200}
            fill="var(--fill-0, #1A2B3C)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[8px] bg-[#f5f3f0] px-[32px] py-[12px]"
      data-name="Button"
    >
      <Container35 />
      <Container36 />
    </div>
  );
}

function BottomActionBar() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-center justify-between"
      data-name="Bottom Action Bar"
    >
      <Container32 />
      <Button14 />
    </div>
  );
}

function RightColumnDataPreviewValidation() {
  return (
    <div
      className="relative flex w-[757.34px] shrink-0 flex-col content-stretch items-start gap-[24px] self-stretch"
      data-name="Right Column: Data Preview & Validation"
    >
      <BackgroundBorderShadow />
      <BottomActionBar />
    </div>
  );
}

function Container37() {
  return (
    <div className="relative h-[16px] w-[18px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 16"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p28ce3f00}
            fill="var(--fill-0, #FF8C00)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 3">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding pl-[118.11px]">
          <div className="relative flex h-[28px] w-[162.53px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[20px] not-italic leading-[0]">
            <p className="whitespace-pre-wrap leading-[28px]">
              מיפוי שדות מהאקסל
            </p>
          </div>
          <Container37 />
        </div>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[276.84px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">
            התאימו את עמודות האקסל לשדות המערכת שלנו
          </p>
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Label"
    >
      <div className="relative flex h-[20px] w-[65.78px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">שם הספק *</p>
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
      className="absolute top-0 left-0 flex h-[38px] w-[312.66px] flex-col content-stretch items-end justify-center overflow-clip py-[8.5px] pr-[9px] pl-[282.66px]"
      data-name="image fill"
    >
      <Svg />
    </div>
  );
}

function Container40() {
  return (
    <div
      className="absolute top-1/2 right-[41px] left-[13px] flex -translate-y-1/2 flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[162.66px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#181510] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          Supplier_Name (עמודה A)
        </p>
      </div>
    </div>
  );
}

function Options() {
  return (
    <div
      className="relative h-[38px] w-full shrink-0 rounded-[8px] bg-white"
      data-name="Options"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[#e7e1da] border-solid"
      />
      <ImageFill />
      <Container40 />
    </div>
  );
}

function MappingRow() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[6px]"
      data-name="Mapping Row 1"
    >
      <Label />
      <Options />
    </div>
  );
}

function Label1() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Label"
    >
      <div className="relative flex h-[20px] w-[45.66px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">קטגוריה</p>
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
      className="absolute top-0 left-0 flex h-[38px] w-[312.66px] flex-col content-stretch items-end justify-center overflow-clip py-[8.5px] pr-[9px] pl-[282.66px]"
      data-name="image fill"
    >
      <Svg1 />
    </div>
  );
}

function Container41() {
  return (
    <div
      className="absolute top-1/2 right-[41px] left-[13px] flex -translate-y-1/2 flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[122.81px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#181510] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">Category (עמודה B)</p>
      </div>
    </div>
  );
}

function Options1() {
  return (
    <div
      className="relative h-[38px] w-full shrink-0 rounded-[8px] bg-white"
      data-name="Options"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[#e7e1da] border-solid"
      />
      <ImageFill1 />
      <Container41 />
    </div>
  );
}

function MappingRow1() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[6px]"
      data-name="Mapping Row 2"
    >
      <Label1 />
      <Options1 />
    </div>
  );
}

function Label2() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Label"
    >
      <div className="relative flex h-[20px] w-[30.81px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">טלפון</p>
      </div>
    </div>
  );
}

function Svg2() {
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

function ImageFill2() {
  return (
    <div
      className="absolute top-0 left-0 flex h-[38px] w-[312.66px] flex-col content-stretch items-end justify-center overflow-clip py-[8.5px] pr-[9px] pl-[282.66px]"
      data-name="image fill"
    >
      <Svg2 />
    </div>
  );
}

function Container42() {
  return (
    <div
      className="absolute top-1/2 right-[40.99px] left-[13px] flex -translate-y-1/2 flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[157.38px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#181510] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          Mobile_Phone (עמודה C)
        </p>
      </div>
    </div>
  );
}

function Options2() {
  return (
    <div
      className="relative h-[38px] w-full shrink-0 rounded-[8px] bg-white"
      data-name="Options"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[#e7e1da] border-solid"
      />
      <ImageFill2 />
      <Container42 />
    </div>
  );
}

function MappingRow2() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[6px]"
      data-name="Mapping Row 3"
    >
      <Label2 />
      <Options2 />
    </div>
  );
}

function Label3() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Label"
    >
      <div className="relative flex h-[20px] w-[34.47px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1a2b3c] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">אימייל</p>
      </div>
    </div>
  );
}

function Svg3() {
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

function ImageFill3() {
  return (
    <div
      className="absolute top-0 left-0 flex h-[38px] w-[312.66px] flex-col content-stretch items-end justify-center overflow-clip py-[8.5px] pr-[9px] pl-[282.66px]"
      data-name="image fill"
    >
      <Svg3 />
    </div>
  );
}

function Container43() {
  return (
    <div
      className="absolute top-1/2 right-[41px] left-[13px] flex -translate-y-1/2 flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[159.59px] shrink-0 flex-col justify-center text-right font-['Plus_Jakarta_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#181510] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          Email_Address (עמודה D)
        </p>
      </div>
    </div>
  );
}

function Options3() {
  return (
    <div
      className="relative h-[38px] w-full shrink-0 rounded-[8px] bg-white"
      data-name="Options"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[#e7e1da] border-solid"
      />
      <ImageFill3 />
      <Container43 />
    </div>
  );
}

function MappingRow3() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[6px]"
      data-name="Mapping Row 4"
    >
      <Label3 />
      <Options3 />
    </div>
  );
}

function Container39() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding pt-[8px] pb-[16px]">
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
    <div className="relative size-[18px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.p128e1bc0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[128.56px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[16px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">בצע בדיקת כפילויות</p>
      </div>
    </div>
  );
}

function Button15() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[8px] bg-[#ff8c00]"
      data-name="Button"
    >
      <div className="relative flex w-full content-stretch items-center justify-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding py-[12px]">
        <div
          className="absolute inset-0 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
          data-name="Button:shadow"
        />
        <Container44 />
        <Container45 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative w-full shrink-0" data-name="HorizontalBorder">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e7e1da] border-t border-solid"
      />
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding pt-[25px]">
        <Button15 />
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
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e7e1da] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex w-full flex-col content-stretch items-start gap-[16px] p-[25px]">
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
    <div
      className="relative flex w-[362.66px] shrink-0 flex-col content-stretch items-start self-stretch"
      data-name="Left Column: Mapping Settings"
    >
      <BackgroundBorderShadow1 />
    </div>
  );
}

function MainContentAreaFieldMappingPreview() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-center gap-[32px] pt-[8px]"
      data-name="Main Content Area: Field Mapping & Preview"
    >
      <RightColumnDataPreviewValidation />
      <LeftColumnMappingSettings />
    </div>
  );
}

function Main() {
  return (
    <div className="relative w-full max-w-[1200px] shrink-0" data-name="Main">
      <div className="flex size-full max-w-[inherit] flex-col items-end">
        <div className="relative flex w-full max-w-[inherit] flex-col content-stretch items-end gap-[24px] px-[24px] py-[40px]">
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
    <div className="relative w-full shrink-0" data-name="Main:margin">
      <div className="relative flex w-full flex-col content-stretch items-start px-[40px]">
        <Main />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-center border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[20px] w-[364.17px] shrink-0 flex-col justify-center text-center font-['FreeSans:Regular',sans-serif] text-[#8d785e] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">
            © 2024 מערכת ניהול ספקים למפיקי אירועים. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </div>
  );
}

function FooterDivClassFlexFlexColItemsCenterGap6RoundedXlBorder2BorderDashedBorderE7E1DaBgWh() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start pt-[25px] pb-[24px]"
      data-name="Footer - div class='flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#e7e1da] bg-wh..."
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e7e1da] border-t border-solid"
      />
      <Container46 />
    </div>
  );
}

function Container() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start justify-between"
      data-name="Container"
    >
      <HeaderTopNavigationBar />
      <MainMargin />
      <FooterDivClassFlexFlexColItemsCenterGap6RoundedXlBorder2BorderDashedBorderE7E1DaBgWh />
    </div>
  );
}

export default function Component() {
  return (
    <div
      className="relative flex size-full flex-col content-stretch items-start justify-center bg-[#f8f7f5]"
      data-name="אשף ייבוא ספקים - עם תווית"
    >
      <Container />
    </div>
  );
}
