import imgImageBackground from "figma:asset/2e0e61f45188a2679a1982701f7dbf774ccdf62c.png";
import imgMap from "figma:asset/4feb32445a1ae2d8a2330be586cd72d25211e80c.png";
import imgCheesePlatter from "figma:asset/22c3283d2f2a176a9b2117d45f4d9538f87ad363.png";
import imgPrivateEvent from "figma:asset/28de4f85f9f2231771e1ac581820879c221fade5.png";
import imgSupplierLogo from "figma:asset/7323241374a3d253bf58154b8faa84506eebc29b.png";
import imgWineryTour from "figma:asset/f876b5d0a60a52a9c1de836bf27cd415eb2b0e81.png";
import svgPaths from "./svg-s8cuujrh6l";

function Container3() {
  return (
    <div className="relative h-[18px] w-[16px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 18"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p2780bd80}
            fill="var(--fill-0, #EF4444)"
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
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[12px] bg-[#f1f5f9] p-[9px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e2e8f0] border-solid"
      />
      <Container3 />
    </div>
  );
}

function Container4() {
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
          <path d={svgPaths.pad10a80} fill="var(--fill-0, #334155)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[12px] bg-[#f1f5f9] px-[17px] py-[9px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e2e8f0] border-solid"
      />
      <div className="relative flex h-[24px] w-[40.11px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#334155] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">עריכה</p>
      </div>
      <Container4 />
    </div>
  );
}

function Container5() {
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
          <path d={svgPaths.p1caa9380} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[8px] rounded-[12px] bg-[#ec5b13] px-[16px] py-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      data-name="Button"
    >
      <div className="relative flex h-[24px] w-[70px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[16px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">אימות ספק</p>
      </div>
      <Container5 />
    </div>
  );
}

function Container2() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[12px]"
      data-name="Container"
    >
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function Margin() {
  return (
    <div
      className="relative z-[1] mr-[-0.01px] h-[12.25px] w-[16.833px] shrink-0"
      data-name="Margin"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16.8333 12.25"
      >
        <title>Interface icon</title>
        <g id="Margin">
          <path d={svgPaths.p89f4b80} fill="var(--fill-0, #065F46)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div
      className="relative isolate flex shrink-0 content-stretch items-center rounded-[9999px] bg-[#d1fae5] py-[2px] pr-[10.01px] pl-[10px]"
      data-name="Background"
    >
      <div className="relative z-[2] mr-[-0.01px] flex h-[16px] w-[33.38px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#065f46] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מאומת</p>
      </div>
      <Margin />
    </div>
  );
}

function Heading() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 1"
    >
      <div className="relative flex h-[36px] w-[174.34px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[30px] not-italic leading-[0] tracking-[-0.75px]">
        <p className="whitespace-pre-wrap leading-[36px]">יקב רמת נפתלי</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-center gap-[12px]"
      data-name="Container"
    >
      <Background />
      <Heading />
    </div>
  );
}

function Container10() {
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
          <path
            d={svgPaths.p1013a180}
            fill="var(--fill-0, #64748B)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[8px] pl-[71.43px]">
          <div className="relative flex h-[24px] w-[160.3px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[16px] not-italic leading-[0]">
            <p className="whitespace-pre-wrap leading-[24px]">
              יקבים וסיורי יין • גליל עליון
            </p>
          </div>
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start gap-[4px]"
      data-name="Container"
    >
      <Container8 />
      <Container9 />
    </div>
  );
}

function SupplierLogo() {
  return (
    <div
      className="relative h-full min-h-px min-w-px flex-[1_0_0]"
      data-name="Supplier Logo"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden border-0 border-[transparent] border-solid bg-clip-padding">
        <img
          alt=""
          className="absolute top-0 left-0 size-full max-w-none"
          height="600"
          src={imgSupplierLogo}
          width="800"
        />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div
      className="relative size-[80px] shrink-0 rounded-[16px] bg-[#f1f5f9]"
      data-name="Background+Border"
    >
      <div className="relative flex size-full content-stretch items-center justify-center overflow-clip rounded-[inherit] p-px">
        <SupplierLogo />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#e2e8f0] border-solid"
      />
    </div>
  );
}

function Container6() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center gap-[24px]"
      data-name="Container"
    >
      <Container7 />
      <BackgroundBorder />
    </div>
  );
}

function Container1() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-center justify-between"
      data-name="Container"
    >
      <Container2 />
      <Container6 />
    </div>
  );
}

function Button3() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="relative flex flex-col content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding pt-px pb-[17px]">
        <div className="relative flex h-[20px] w-[50.66px] shrink-0 flex-col justify-center text-center font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">היסטוריה</p>
        </div>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="relative flex flex-col content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding pt-px pb-[17px]">
        <div className="relative flex h-[20px] w-[78.69px] shrink-0 flex-col justify-center text-center font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">יומן התקשרות</p>
        </div>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div
      className="relative flex size-[16px] shrink-0 content-stretch items-center justify-center rounded-[9999px] bg-[#ef4444]"
      data-name="Background"
    >
      <div className="relative flex h-[20px] w-[4.14px] shrink-0 flex-col justify-center text-center font-['FreeSans:Regular',sans-serif] text-[10px] text-white not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">1</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="relative flex content-stretch items-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding pt-px pb-[17px]">
        <Background1 />
        <div className="relative flex h-[20px] w-[45.11px] shrink-0 flex-col justify-center text-center font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">מסמכים</p>
        </div>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="relative flex flex-col content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding pt-px pb-[17px]">
        <div className="relative flex h-[20px] w-[90.84px] shrink-0 flex-col justify-center text-center font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">מוצרים ושירותים</p>
        </div>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#ec5b13] border-b-2 border-solid"
      />
      <div className="relative flex flex-col content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding pb-[18px]">
        <div className="relative flex h-[20px] w-[58.55px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ec5b13] text-[14px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[20px]">מידע כללי</p>
        </div>
      </div>
    </div>
  );
}

function Tabs() {
  return (
    <div className="relative w-full shrink-0" data-name="Tabs">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f1f5f9] border-b border-solid"
      />
      <div className="relative flex w-full content-stretch items-start gap-[32px] pb-px pl-[484.16px]">
        <Button3 />
        <Button4 />
        <Button5 />
        <Button6 />
        <Button7 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[32px] border-0 border-[transparent] border-solid bg-clip-padding px-[32px] py-[24px]">
        <Container1 />
        <Tabs />
      </div>
    </div>
  );
}

function HeaderSection() {
  return (
    <div
      className="relative z-[2] flex w-full shrink-0 flex-col content-stretch items-start bg-white pb-px"
      data-name="Header Section"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e2e8f0] border-b border-solid"
      />
      <Container />
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 2">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[120.66px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[18px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">מיקום ומידע נוסף</p>
        </div>
      </div>
    </div>
  );
}

function MapComponent() {
  return (
    <div
      className="relative min-h-px w-full min-w-px flex-[1_0_0] opacity-70"
      data-name="Map"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-0 border-[transparent] border-solid bg-clip-padding"
      >
        <div className="absolute inset-0 overflow-hidden border-0 border-[transparent] border-solid bg-clip-padding">
          <img
            alt=""
            className="absolute top-[-28.06%] left-0 h-[156.12%] w-full max-w-none"
            height="600"
            src={imgMap}
            width="800"
          />
        </div>
        <div className="absolute inset-0 border-0 border-[transparent] border-solid bg-white bg-clip-padding mix-blend-saturation" />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute inset-px" data-name="Container">
      <div className="relative flex size-full content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding">
        <div
          className="relative size-[16px] shrink-0 rounded-[9999px] bg-[#ec5b13]"
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

function Border() {
  return (
    <div
      className="relative h-[160px] w-full shrink-0 rounded-[12px]"
      data-name="Border"
    >
      <div className="relative flex size-full flex-col content-stretch items-start justify-center overflow-clip rounded-[inherit] p-px">
        <MapComponent />
        <Container12 />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e2e8f0] border-solid"
      />
    </div>
  );
}

function Container16() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[38.19px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">כתובת</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[159.31px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          מושב רמת נפתלי, גליל עליון
        </p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <Container16 />
      <Container17 />
    </div>
  );
}

function Container14() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start gap-[12px] pl-[53.34px]">
        <Container15 />
        <div className="relative h-[20px] w-[16px] shrink-0" data-name="Icon">
          <svg
            className="absolute inset-0 block"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 16 20"
          >
            <title>Interface icon</title>
            <path
              d={svgPaths.p1869180}
              fill="var(--fill-0, #94A3B8)"
              id="Icon"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[76.53px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">אתר אינטרנט</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <Container20 />
      <div className="relative flex h-[20px] w-[145.64px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Regular',sans-serif] font-normal text-[#ec5b13] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          www.ramatnaftali.com
        </p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-start gap-[12px] pl-[67.02px]">
        <Container19 />
        <div className="relative size-[20px] shrink-0" data-name="Icon">
          <svg
            className="absolute inset-0 block"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 20 20"
          >
            <title>Interface icon</title>
            <path
              d={svgPaths.p237be000}
              fill="var(--fill-0, #94A3B8)"
              id="Icon"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative h-[10px] w-[20px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 10"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.pc80eb80} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Link">
      <div className="relative flex h-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <Container21 />
      </div>
    </div>
  );
}

function Container22() {
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
            d={svgPaths.p2182f500}
            fill="var(--fill-0, #94A3B8)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Link">
      <div className="relative flex h-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <Container22 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative w-full shrink-0" data-name="HorizontalBorder">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f1f5f9] border-t border-solid"
      />
      <div className="relative flex w-full content-stretch items-start gap-[16px] pt-[9px] pl-[184.64px]">
        <Link />
        <Link1 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[12px]"
      data-name="Container"
    >
      <Container14 />
      <Container18 />
      <HorizontalBorder />
    </div>
  );
}

function Container11() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[20px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Border />
        <Container13 />
      </div>
    </div>
  );
}

function SectionLocationInfo() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[16px] bg-white"
      data-name="Section - Location & Info"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#e2e8f0] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex w-full flex-col content-stretch items-start gap-[16px] p-[25px]">
        <Heading1 />
        <Container11 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="relative size-[12px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 12 12"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p3537f500}
            fill="var(--fill-0, #1E293B)"
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
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center rounded-[8px] p-[4px]"
      data-name="Button"
    >
      <Container24 />
    </div>
  );
}

function Heading2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 2"
    >
      <div className="relative flex h-[28px] w-[115.73px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[18px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">מסמכים ותקינות</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full content-stretch items-center justify-between border-0 border-[transparent] border-solid bg-clip-padding">
        <Button8 />
        <Heading2 />
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
          <path d={svgPaths.p1041200} fill="var(--fill-0, #059669)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[50.08px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#064e3b] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">רישיון עסק</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[15px] w-[97.34px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#047857] text-[10px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[15px]">
          בתוקף עד: 01/01/2026
        </p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <Container29 />
      <Container30 />
    </div>
  );
}

function Container31() {
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
            d={svgPaths.p15aec574}
            fill="var(--fill-0, #059669)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container28 />
        <Container31 />
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-[#ecfdf5]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#d1fae5] border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between p-[13px]">
          <Container26 />
          <Container27 />
        </div>
      </div>
    </div>
  );
}

function Container32() {
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
          <path d={svgPaths.p1041200} fill="var(--fill-0, #059669)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[69.23px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#064e3b] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">תעודת כשרות</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[15px] w-[99.88px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#047857] text-[10px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[15px]">
          בתוקף עד: 15/09/2024
        </p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <Container35 />
      <Container36 />
    </div>
  );
}

function Container37() {
  return (
    <div className="relative h-[21px] w-[16px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 21"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p1c671000}
            fill="var(--fill-0, #059669)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container34 />
        <Container37 />
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-[#ecfdf5]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#d1fae5] border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between p-[13px]">
          <Container32 />
          <Container33 />
        </div>
      </div>
    </div>
  );
}

function Container38() {
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
          <path
            d={svgPaths.p12539700}
            fill="var(--fill-0, #DC2626)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container41() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[55.2px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#7f1d1d] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">{`ביטוח צד ג'`}</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[15px] w-[99.75px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#b91c1c] text-[10px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[15px]">
          פג תוקף ב-01/05/2024
        </p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-start"
      data-name="Container"
    >
      <Container41 />
      <Container42 />
    </div>
  );
}

function Container43() {
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
            d={svgPaths.p2b677030}
            fill="var(--fill-0, #DC2626)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container39() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container40 />
        <Container43 />
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-[#fef2f2]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#fee2e2] border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between py-[13px] pr-[12.99px] pl-[13px]">
          <Container38 />
          <Container39 />
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[16px] border-0 border-[transparent] border-solid bg-clip-padding">
        <BackgroundBorder1 />
        <BackgroundBorder2 />
        <BackgroundBorder3 />
      </div>
    </div>
  );
}

function SectionDocumentsStatus() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[16px] bg-white"
      data-name="Section - Documents Status"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#e2e8f0] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex w-full flex-col content-stretch items-start gap-[16px] p-[25px]">
        <Container23 />
        <Container25 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 2">
      <div className="relative flex w-full flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding">
        <div className="relative flex h-[28px] w-[121.73px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[18px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[28px]">תקשורת אחרונה</p>
        </div>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div
      className="absolute top-0 right-[31.99px] left-0 flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[55.88px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">היום, 10:45</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div
      className="absolute top-[20px] right-[32px] left-0 flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[105.75px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">שיחת טלפון נכנסת</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div
      className="absolute top-[40px] right-[32px] left-0 flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[212.14px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          עדכון מחירים לאירועי חברה ברבעון 4.
        </p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative h-[60px] w-full shrink-0" data-name="Container">
      <Container46 />
      <Container47 />
      <Container48 />
      <div
        className="absolute top-0 right-[4px] size-[16px] rounded-[9999px] border-4 border-white border-solid bg-[#ec5b13]"
        data-name="Background+Border"
      />
    </div>
  );
}

function Container50() {
  return (
    <div
      className="absolute top-0 right-[32px] left-0 flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[68.58px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">אתמול, 14:20</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div
      className="absolute top-[20px] right-[32px] left-0 flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[48.95px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">מייל יוצא</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div
      className="absolute top-[40px] right-[32px] left-0 flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[40px] w-[202.58px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[20px]">
        <p className="mb-0">בקשה לקבלת הצעת מחיר לפרויקט</p>
        <p>{`'קוקה קולה 2024'.`}</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative h-[80px] w-full shrink-0" data-name="Container">
      <Container50 />
      <Container51 />
      <Container52 />
      <div
        className="absolute top-0 right-[4px] size-[16px] rounded-[9999px] border-4 border-white border-solid bg-[#e2e8f0]"
        data-name="Background+Border"
      />
    </div>
  );
}

function Container54() {
  return (
    <div
      className="absolute top-0 right-[32px] left-0 flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[68.95px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Regular','Arimo:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">12 ביוני, 2024</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div
      className="relative h-[6.25px] w-[10px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6.25"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p2ab77a00}
            fill="var(--fill-0, #94A3B8)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container55() {
  return (
    <div
      className="absolute top-[20px] right-[32px] left-0 flex content-stretch items-center gap-[3.99px] pl-[120.22px]"
      data-name="Container"
    >
      <Container56 />
      <div className="relative flex h-[20px] w-[80.44px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">העלאת מסמך</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div
      className="absolute top-[40px] right-[32px] left-0 flex flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[40px] w-[185.29px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[20px]">
        <p className="mb-0">תעודת כשרות מעודכנת הועלתה</p>
        <p>למערכת.</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="relative h-[80px] w-full shrink-0" data-name="Container">
      <Container54 />
      <Container55 />
      <Container57 />
      <div
        className="absolute top-0 right-[4px] size-[16px] rounded-[9999px] border-4 border-white border-solid bg-[#e2e8f0]"
        data-name="Background+Border"
      />
    </div>
  );
}

function Container44() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="relative flex w-full flex-col content-stretch items-start gap-[24px] border-0 border-[transparent] border-solid bg-clip-padding">
        <div
          className="absolute top-[8px] right-[12px] bottom-[8px] w-px bg-[#f1f5f9]"
          data-name="Vertical Divider"
        />
        <Container45 />
        <Container49 />
        <Container53 />
      </div>
    </div>
  );
}

function SectionCommunicationLog() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[16px] bg-white"
      data-name="Section - Communication Log"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#e2e8f0] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex w-full flex-col content-stretch items-start gap-[16px] p-[25px]">
        <Heading3 />
        <Container44 />
      </div>
    </div>
  );
}

function LeftColumnDetailsDocs() {
  return (
    <div
      className="relative flex w-[298.67px] shrink-0 flex-col content-stretch items-start gap-[32px] self-stretch"
      data-name="Left Column: Details & Docs"
    >
      <SectionLocationInfo />
      <SectionDocumentsStatus />
      <SectionCommunicationLog />
    </div>
  );
}

function Container59() {
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
            d={svgPaths.p38ac19c0}
            fill="var(--fill-0, #EC5B13)"
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
      className="relative flex shrink-0 content-stretch items-center gap-[4.01px]"
      data-name="Button"
    >
      <div className="relative flex h-[20px] w-[93.7px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ec5b13] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">הוספת איש קשר</p>
      </div>
      <Container59 />
    </div>
  );
}

function Heading4() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 2"
    >
      <div className="relative flex h-[28px] w-[82.98px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[20px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">אנשי קשר</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between">
          <Button9 />
          <Heading4 />
        </div>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[24px] w-[51.34px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">מיכל לוי</p>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center pl-[149.33px]">
          <Heading5 />
        </div>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[120.7px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          מנהלת אירועים ושיווק
        </p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[87.25px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Regular',sans-serif] font-normal text-[#1e293b] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">050-7654321</p>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative size-[13.5px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13.5 13.5"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.pb3c9680} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container65() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[8px] pl-[87.42px]">
          <Container66 />
          <Container67 />
        </div>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[163.38px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Regular',sans-serif] font-normal text-[#1e293b] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          michal@ramatnaftali.co.il
        </p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="relative h-[12px] w-[15px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 12"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p37f50280}
            fill="var(--fill-0, #94A3B8)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container68() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[7.99px] pl-[11.3px]">
          <Container69 />
          <Container70 />
        </div>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[8px] pt-[8px]"
      data-name="Container"
    >
      <Container65 />
      <Container68 />
    </div>
  );
}

function Container61() {
  return (
    <div
      className="relative min-h-px min-w-px flex-[1_0_0]"
      data-name="Container"
    >
      <div className="relative flex w-full flex-col content-stretch items-start gap-[4px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container62 />
        <Container63 />
        <Container64 />
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div
      className="relative size-[48px] shrink-0 rounded-[9999px] bg-[#f1f5f9]"
      data-name="Background"
    >
      <div className="relative flex size-full content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding pt-[11.5px] pb-[12.5px]">
        <div className="relative flex h-[24px] w-[19.55px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#475569] text-[16px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[24px]">מל</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div
      className="relative flex w-[306.67px] shrink-0 content-stretch items-start gap-[16px] self-stretch rounded-[16px] bg-white p-[21px]"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#e2e8f0] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <Container61 />
      <Background2 />
    </div>
  );
}

function Background3() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end rounded-[9999px] bg-[#d1fae5] px-[8px] py-[2px]"
      data-name="Background"
    >
      <div className="relative flex h-[17px] w-[23.8px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#065f46] text-[11px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16.5px]">ראשי</p>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 3"
    >
      <div className="relative flex h-[24px] w-[65.94px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">יצחק ברוך</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center justify-between">
          <Background3 />
          <Heading6 />
        </div>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[78.83px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">{`בעלים ומנכ"ל`}</p>
      </div>
    </div>
  );
}

function Container76() {
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
            d={svgPaths.p3ffd6800}
            fill="var(--fill-0, #25D366)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center justify-center"
      data-name="Button"
    >
      <Container76 />
    </div>
  );
}

function ButtonMargin() {
  return (
    <div
      className="relative min-h-px min-w-[24.020000457763672px] flex-[1_0_0]"
      data-name="Button:margin"
    >
      <div className="relative flex w-full min-w-[inherit] flex-col content-stretch items-start pr-[54.719px]">
        <Button10 />
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[87.92px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Regular',sans-serif] font-normal text-[#1e293b] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">054-1234567</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="relative size-[13.5px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13.5 13.5"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path d={svgPaths.pb3c9680} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container75() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-center gap-[8px]"
      data-name="Container"
    >
      <ButtonMargin />
      <Container77 />
      <Container78 />
    </div>
  );
}

function Container80() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[167.03px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Regular',sans-serif] font-normal text-[#1e293b] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          yitzhak@ramatnaftali.co.il
        </p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="relative h-[12px] w-[15px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 12"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p37f50280}
            fill="var(--fill-0, #94A3B8)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Container79() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[8px] pl-[7.63px]">
          <Container80 />
          <Container81 />
        </div>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[8px] pt-[8px]"
      data-name="Container"
    >
      <Container75 />
      <Container79 />
    </div>
  );
}

function Container71() {
  return (
    <div
      className="relative min-h-px min-w-px flex-[1_0_0]"
      data-name="Container"
    >
      <div className="relative flex w-full flex-col content-stretch items-start gap-[4px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container72 />
        <Container73 />
        <Container74 />
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div
      className="relative size-[48px] shrink-0 rounded-[9999px] bg-[rgba(236,91,19,0.1)]"
      data-name="Overlay"
    >
      <div className="relative flex size-full content-stretch items-center justify-center border-0 border-[transparent] border-solid bg-clip-padding pt-[11.5px] pb-[12.5px]">
        <div className="relative flex h-[24px] w-[12.66px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ec5b13] text-[16px] not-italic leading-[0]">
          <p className="whitespace-pre-wrap leading-[24px]">יב</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div
      className="relative flex w-[306.66px] shrink-0 content-stretch items-start gap-[16px] self-stretch rounded-[16px] bg-white p-[21px]"
      data-name="Background+Border+Shadow"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[16px] border border-[#e2e8f0] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <Container71 />
      <Overlay />
    </div>
  );
}

function Container60() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-center gap-[16px]"
      data-name="Container"
    >
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
    </div>
  );
}

function SectionContactPersons() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[16px]"
      data-name="Section - Contact Persons"
    >
      <Container58 />
      <Container60 />
    </div>
  );
}

function Button11() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-center justify-center"
      data-name="Button"
    >
      <div className="relative flex h-[20px] w-[130.81px] shrink-0 flex-col justify-center text-center font-['FreeSans:Semi_Bold',sans-serif] text-[#ec5b13] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          צפייה בכל המוצרים (6)
        </p>
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Heading 2"
    >
      <div className="relative flex h-[28px] w-[129.52px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[20px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[28px]">מוצרים ושירותים</p>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-center justify-between"
      data-name="Container"
    >
      <Button11 />
      <Heading7 />
    </div>
  );
}

function Heading8() {
  return (
    <div
      className="absolute top-[121px] right-0 left-0 flex flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[24px] w-[119px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">אירועי חברה בוטיק</p>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div
      className="absolute top-[145px] right-0 left-0 flex flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[32px] w-[168.14px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[12px] not-italic leading-[16px]">
        <p className="mb-0">{" איש במרפסת50אירוח קבוצות עד "}</p>
        <p>היקב המשקיפה לעמק קדש.</p>
      </div>
    </div>
  );
}

function PrivateEvent() {
  return (
    <div
      className="relative h-[109px] w-full shrink-0"
      data-name="Private Event"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute top-[-38.89%] left-0 h-[177.78%] w-full max-w-none"
          height="600"
          src={imgPrivateEvent}
          width="800"
        />
      </div>
    </div>
  );
}

function OverlayShadowOverlayBlur() {
  return (
    <div
      className="absolute top-[8px] left-[8px] flex flex-col content-stretch items-end rounded-[8px] bg-[rgba(255,255,255,0.9)] px-[8px] py-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[4px]"
      data-name="Overlay+Shadow+OverlayBlur"
    >
      <div className="relative flex h-[16px] w-[82.08px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Bold','Arimo:Bold','Noto_Sans:Bold',sans-serif] font-bold text-[#1e293b] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">החל מ-₪5,000</p>
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div
      className="absolute top-0 right-0 left-0 flex aspect-video flex-col content-stretch items-start justify-center overflow-clip rounded-[12px]"
      data-name="Container"
    >
      <PrivateEvent />
      <OverlayShadowOverlayBlur />
    </div>
  );
}

function Container84() {
  return (
    <div
      className="relative w-[193.78px] shrink-0 self-stretch"
      data-name="Container"
    >
      <Heading8 />
      <Container85 />
      <Container86 />
    </div>
  );
}

function Heading9() {
  return (
    <div
      className="absolute top-[121px] right-[-0.01px] left-0 flex flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[24px] w-[134.61px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          פלטת גבינות גליליות
        </p>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div
      className="absolute top-[145px] right-0 left-0 flex flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[32px] w-[175.71px] shrink-0 flex-col justify-center whitespace-pre-wrap text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[12px] not-italic leading-[16px]">
        <p className="mb-0">מבחר גבינות ממחלבות בוטיק באזור,</p>
        <p>לחמי מחמצת, זיתים וממרחים ביתיים.</p>
      </div>
    </div>
  );
}

function CheesePlatter() {
  return (
    <div
      className="relative h-[109px] w-full shrink-0"
      data-name="Cheese Platter"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute top-[-38.89%] left-0 h-[177.78%] w-full max-w-none"
          height="600"
          src={imgCheesePlatter}
          width="800"
        />
      </div>
    </div>
  );
}

function OverlayShadowOverlayBlur1() {
  return (
    <div
      className="absolute top-[8px] left-[8px] flex flex-col content-stretch items-end rounded-[8px] bg-[rgba(255,255,255,0.9)] px-[8px] py-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[4px]"
      data-name="Overlay+Shadow+OverlayBlur"
    >
      <div className="relative flex h-[16px] w-[66.13px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">₪85 / לאדם</p>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div
      className="absolute top-0 right-0 left-0 flex aspect-video flex-col content-stretch items-start justify-center overflow-clip rounded-[12px]"
      data-name="Container"
    >
      <CheesePlatter />
      <OverlayShadowOverlayBlur1 />
    </div>
  );
}

function Container87() {
  return (
    <div
      className="relative w-[193.78px] shrink-0 self-stretch"
      data-name="Container"
    >
      <Heading9 />
      <Container88 />
      <Container89 />
    </div>
  );
}

function Heading10() {
  return (
    <div
      className="absolute top-[120.98px] right-0 left-0 flex flex-col content-stretch items-end"
      data-name="Heading 4"
    >
      <div className="relative flex h-[24px] w-[127.52px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          סיור ביקב וטעימות יין
        </p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div
      className="absolute top-[144.98px] right-0 left-0 isolate flex content-stretch items-end justify-end overflow-clip text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[12px] not-italic"
      data-name="Paragraph"
    >
      <div className="relative z-[2] flex h-[16px] w-[9.22px] shrink-0 flex-col justify-center leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">…</p>
      </div>
      <div className="relative z-[1] flex h-[32px] w-[177.73px] shrink-0 flex-col justify-center whitespace-pre-wrap leading-[16px]">
        <p className="mb-0">סיור מודרך בכרמים ובמרתפי היקב</p>
        <p>הכולל הסבר על תהליכי הייצור וטעי</p>
      </div>
    </div>
  );
}

function WineryTour() {
  return (
    <div
      className="relative h-[108.98px] w-full shrink-0"
      data-name="Winery Tour"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute top-[-38.9%] left-0 h-[177.8%] w-full max-w-none"
          height="600"
          src={imgWineryTour}
          width="800"
        />
      </div>
    </div>
  );
}

function OverlayShadowOverlayBlur2() {
  return (
    <div
      className="absolute top-[8px] left-[8px] flex flex-col content-stretch items-end rounded-[8px] bg-[rgba(255,255,255,0.9)] px-[8px] py-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[4px]"
      data-name="Overlay+Shadow+OverlayBlur"
    >
      <div className="relative flex h-[16px] w-[70.45px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Bold','Noto_Sans:Bold','Arimo:Bold',sans-serif] font-bold text-[#1e293b] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">₪120 / לאדם</p>
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div
      className="absolute top-0 right-0 left-0 flex aspect-video flex-col content-stretch items-start justify-center overflow-clip rounded-[12px]"
      data-name="Container"
    >
      <WineryTour />
      <OverlayShadowOverlayBlur2 />
    </div>
  );
}

function Container90() {
  return (
    <div
      className="relative w-[193.77px] shrink-0 self-stretch"
      data-name="Container"
    >
      <Heading10 />
      <Paragraph />
      <Container91 />
    </div>
  );
}

function Container83() {
  return (
    <div
      className="relative flex w-full shrink-0 content-stretch items-start justify-center gap-[24px]"
      data-name="Container"
    >
      <Container84 />
      <Container87 />
      <Container90 />
    </div>
  );
}

function SectionProductsPreview() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[16px]"
      data-name="Section - Products Preview"
    >
      <Container82 />
      <Container83 />
    </div>
  );
}

function RightColumnGeneralInfo() {
  return (
    <div
      className="relative flex w-[629.33px] shrink-0 flex-col content-stretch items-start gap-[32px] self-stretch"
      data-name="Right Column: General Info"
    >
      <SectionContactPersons />
      <SectionProductsPreview />
    </div>
  );
}

function ContentArea() {
  return (
    <div className="relative z-[1] w-full shrink-0" data-name="Content Area">
      <div className="flex size-full flex-row justify-center">
        <div className="relative flex w-full content-stretch items-start justify-center gap-[32px] p-[32px]">
          <LeftColumnDetailsDocs />
          <RightColumnGeneralInfo />
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div
      className="relative isolate flex h-[1459px] min-h-[1459px] min-w-px flex-[1_0_0] flex-col content-stretch items-start overflow-clip"
      data-name="Main Content"
    >
      <HeaderSection />
      <ContentArea />
    </div>
  );
}

function Heading11() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end"
      data-name="Heading 1"
    >
      <div className="relative flex h-[18px] w-[82.78px] shrink-0 flex-col justify-center text-right font-['Public_Sans:Bold',sans-serif] font-bold text-[#1e293b] text-[18px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[18px]">TravelPro</p>
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
      <div className="relative flex h-[16px] w-[100.97px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">
          ניהול הפקות ואירועים
        </p>
      </div>
    </div>
  );
}

function Container92() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="relative flex flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding">
        <Heading11 />
        <Container93 />
      </div>
    </div>
  );
}

function Container94() {
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
          <path d={svgPaths.p176f0bb4} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div
      className="relative shrink-0 rounded-[8px] bg-[#ec5b13]"
      data-name="Background"
    >
      <div className="relative flex flex-col content-stretch items-end border-0 border-[transparent] border-solid bg-clip-padding p-[8px]">
        <Container94 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative w-full shrink-0" data-name="HorizontalBorder">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f1f5f9] border-b border-solid"
      />
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] border-0 border-[transparent] border-solid bg-clip-padding pt-[24px] pr-[24px] pb-[25px] pl-[78.02px]">
          <Container92 />
          <Background4 />
        </div>
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[56.55px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#475569] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">לוח בקרה</p>
      </div>
    </div>
  );
}

function Container96() {
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
            d={svgPaths.p20793584}
            fill="var(--fill-0, #475569)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative w-full shrink-0 rounded-[12px]" data-name="Link">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] py-[12px] pr-[16px] pl-[114.44px]">
          <Container95 />
          <Container96 />
        </div>
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[36.47px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#ec5b13] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">ספקים</p>
      </div>
    </div>
  );
}

function Container98() {
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
          <path
            d={svgPaths.p130f1800}
            fill="var(--fill-0, #EC5B13)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Link3() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[12px] bg-[rgba(236,91,19,0.1)]"
      data-name="Link"
    >
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] py-[12px] pr-[16px] pl-[134.52px]">
          <Container97 />
          <Container98 />
        </div>
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[49.91px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#475569] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">פרויקטים</p>
      </div>
    </div>
  );
}

function Container100() {
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
          <path d={svgPaths.p9135100} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative w-full shrink-0 rounded-[12px]" data-name="Link">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] py-[12px] pr-[16px] pl-[121.08px]">
          <Container99 />
          <Container100 />
        </div>
      </div>
    </div>
  );
}

function Container101() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[41.17px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#475569] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">לקוחות</p>
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="relative h-[16px] w-[22px] shrink-0" data-name="Container">
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 22 16"
      >
        <title>Interface icon</title>
        <g id="Container">
          <path
            d={svgPaths.p39955c80}
            fill="var(--fill-0, #475569)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Link5() {
  return (
    <div className="relative w-full shrink-0 rounded-[12px]" data-name="Link">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] py-[12px] pr-[16px] pl-[129.81px]">
          <Container101 />
          <Container102 />
        </div>
      </div>
    </div>
  );
}

function Container103() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[45.11px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#475569] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">מסמכים</p>
      </div>
    </div>
  );
}

function Container104() {
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
          <path d={svgPaths.pc679c40} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link6() {
  return (
    <div className="relative w-full shrink-0 rounded-[12px]" data-name="Link">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] py-[12px] pr-[16px] pl-[125.88px]">
          <Container103 />
          <Container104 />
        </div>
      </div>
    </div>
  );
}

function Container105() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[43.86px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#475569] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">הגדרות</p>
      </div>
    </div>
  );
}

function Container106() {
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
            fill="var(--fill-0, #475569)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function Link7() {
  return (
    <div className="relative w-full shrink-0 rounded-[12px]" data-name="Link">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[11.99px] border-0 border-[transparent] border-solid bg-clip-padding py-[12px] pr-[16px] pl-[127.13px]">
          <Container105 />
          <Container106 />
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
        className="pointer-events-none absolute inset-0 border-[#f1f5f9] border-t border-solid"
      />
      <Link7 />
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
        <div className="relative flex size-full flex-col content-stretch items-start gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding p-[16px]">
          <Link2 />
          <Link3 />
          <Link4 />
          <Link5 />
          <Link6 />
          <HorizontalBorder2 />
        </div>
      </div>
    </div>
  );
}

function Container109() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[56.2px] shrink-0 flex-col justify-center text-right font-['FreeSans:Semi_Bold',sans-serif] text-[#1e293b] text-[14px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">אלכס כהן</p>
      </div>
    </div>
  );
}

function Container110() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-end overflow-clip"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[58.59px] shrink-0 flex-col justify-center text-right font-['FreeSans:Regular',sans-serif] text-[#64748b] text-[12px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מנהל הפקה</p>
      </div>
    </div>
  );
}

function Container108() {
  return (
    <div
      className="relative flex min-h-px min-w-px flex-[1_0_0] flex-col content-stretch items-start overflow-clip"
      data-name="Container"
    >
      <Container109 />
      <Container110 />
    </div>
  );
}

function Container107() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[12px] border-0 border-[transparent] border-solid bg-clip-padding px-[8px]">
          <Container108 />
          <div
            className="relative size-[40px] shrink-0 rounded-[9999px]"
            data-name="Image+Background"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[9999px]"
            >
              <div className="absolute inset-0 rounded-[9999px] bg-[#e2e8f0]" />
              <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
                <img
                  alt=""
                  className="absolute top-0 left-0 size-full max-w-none"
                  height="600"
                  src={imgImageBackground}
                  width="800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder3() {
  return (
    <div className="relative w-full shrink-0" data-name="HorizontalBorder">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f1f5f9] border-t border-solid"
      />
      <div className="relative flex w-full flex-col content-stretch items-start border-0 border-[transparent] border-solid bg-clip-padding px-[16px] pt-[17px] pb-[16px]">
        <Container107 />
      </div>
    </div>
  );
}

function AsideSidebar() {
  return (
    <div
      className="absolute top-0 right-0 bottom-0 flex w-[256px] flex-col content-stretch items-start bg-white pl-px"
      data-name="Aside - Sidebar"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#e2e8f0] border-l border-solid"
      />
      <HorizontalBorder1 />
      <Nav />
      <HorizontalBorder3 />
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div
      className="absolute top-0 right-0 left-0 flex flex-col content-stretch items-center bg-[#facc15] pt-[8px] pb-[10px]"
      data-name="Background+HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-black border-b-2 border-solid"
      />
      <div
        className="absolute inset-0 bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[28px] w-[277.03px] shrink-0 flex-col justify-center text-center font-['Public_Sans:Bold','Arimo:Bold',sans-serif] font-bold text-[18px] text-black leading-[0] tracking-[0.45px]">
        <p className="whitespace-pre-wrap leading-[28px]">
          SCREEN LABEL: כרטיס ספק מלא
        </p>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div
      className="relative flex size-full content-stretch items-start justify-center bg-[#f8f6f6] pt-[48px] pr-[256px]"
      data-name="כרטיס ספק מלא - עם תווית"
    >
      <MainContent />
      <AsideSidebar />
      <BackgroundHorizontalBorder />
    </div>
  );
}
