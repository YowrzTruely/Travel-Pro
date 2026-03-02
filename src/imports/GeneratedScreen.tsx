import svgPaths from "./svg-cgs1dtx2rh";

function Heading() {
  return (
    <div
      className="relative flex shrink-0 content-stretch items-start justify-center pb-[12px]"
      data-name="Heading 1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[#f97316] border-b-4 border-solid"
      />
      <div className="relative flex h-[36px] w-[477.09px] shrink-0 flex-col justify-center text-center font-['Assistant:Bold',sans-serif] font-bold text-[#1e293b] text-[30px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[36px]">
          מפת מסכים וזרימת משתמש - TravelPro
        </p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-center"
      data-name="Container"
    >
      <div className="relative flex h-[24px] w-[333.39px] shrink-0 flex-col justify-center text-center font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[16px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">
          תרשים זרימה פונקציונלי - קשרים בין מודולים ותתי-מסכים
        </p>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div
      className="relative flex w-full shrink-0 flex-col content-stretch items-center gap-[16px]"
      data-name="Page Header"
    >
      <Heading />
      <Container />
    </div>
  );
}

function Margin() {
  return (
    <div
      className="relative z-[1] mr-[-0.01px] flex h-[32px] w-[24px] shrink-0 flex-col content-stretch items-start pl-[12px]"
      data-name="Margin"
    >
      <div
        className="h-[32px] w-[12px] shrink-0 rounded-[9999px] bg-[#f97316]"
        data-name="Background"
      />
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 2">
      <div className="flex size-full flex-row items-center">
        <div className="relative isolate flex w-full content-stretch items-center pr-[0.01px] pl-[846.88px]">
          <div className="relative z-[2] mr-[-0.01px] flex h-[28px] w-[263.13px] shrink-0 flex-col justify-center text-right font-['Assistant:Semi_Bold',sans-serif] text-[#1e293b] text-[20px] not-italic leading-[0]">
            <p className="whitespace-pre-wrap leading-[28px]">
              זרימת ניהול פרויקטים והצעות מחיר
            </p>
          </div>
          <Margin />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#1e293b] px-[18px] pt-[23.5px] pb-[24.5px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-[#1e293b] border-solid"
      />
      <div
        className="absolute top-0 left-1/2 h-[96px] w-[192px] -translate-x-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[48px] w-[97.42px] shrink-0 flex-col justify-center whitespace-pre-wrap text-center font-['Assistant:Bold',sans-serif] font-bold text-[16px] text-white leading-[24px]">
        <p className="mb-0">דאשבורד מרכזי</p>
        <p>(Main Hub)</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div
      className="relative flex h-[24px] w-[192px] shrink-0 flex-col content-stretch items-center px-[95px]"
      data-name="Margin"
    >
      <div
        className="h-[24px] w-[2px] shrink-0 bg-[#cbd5e1]"
        data-name="Vertical Divider"
      />
    </div>
  );
}

function Container2() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[66.42px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">כניסה למערכת</p>
      </div>
    </div>
  );
}

function NodeDashboard() {
  return (
    <div
      className="absolute top-[calc(50%-80px)] left-[942px] flex -translate-y-1/2 flex-col content-stretch items-center"
      data-name="Node: Dashboard"
    >
      <BackgroundBorder />
      <Margin1 />
      <Container2 />
    </div>
  );
}

function Container3() {
  return (
    <div
      className="absolute top-[calc(50%-80px)] left-[894px] h-[5.625px] w-[14.203px] -translate-y-1/2"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14.2031 5.625"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p25bba940}
            fill="var(--fill-0, #CBD5E1)"
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
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-white px-[18px] pt-[35.5px] pb-[36.5px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-[#1e293b] border-solid"
      />
      <div
        className="absolute top-0 left-1/2 h-[96px] w-[192px] -translate-x-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[24px] w-[100.5px] shrink-0 flex-col justify-center text-center font-['Assistant:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">רשימת פרויקטים</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div
      className="relative flex h-[24px] w-[192px] shrink-0 flex-col content-stretch items-center px-[95px]"
      data-name="Margin"
    >
      <div
        className="h-[24px] w-[2px] shrink-0 bg-[#cbd5e1]"
        data-name="Vertical Divider"
      />
    </div>
  );
}

function Container4() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[67.67px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">ניהול תיקי לקוח</p>
      </div>
    </div>
  );
}

function NodeProjectsList() {
  return (
    <div
      className="absolute top-[calc(50%-80px)] left-[678px] flex -translate-y-1/2 flex-col content-stretch items-center"
      data-name="Node: Projects List"
    >
      <BackgroundBorder1 />
      <Margin2 />
      <Container4 />
    </div>
  );
}

function Container5() {
  return (
    <div
      className="absolute top-[calc(50%-80px)] left-[630px] h-[5.625px] w-[14.203px] -translate-y-1/2"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14.2031 5.625"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p25bba940}
            fill="var(--fill-0, #CBD5E1)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-white px-[18px] pt-[23.5px] pb-[24.5px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-[#1e293b] border-solid"
      />
      <div
        className="absolute top-0 left-1/2 h-[96px] w-[192px] -translate-x-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[48px] w-[97.76px] shrink-0 flex-col justify-center whitespace-pre-wrap text-center font-['Assistant:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[24px]">
        <p className="mb-0">פרטי פרויקט</p>
        <p>(תמחור והצעות)</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div
      className="relative flex h-[24px] w-[192px] shrink-0 flex-col content-stretch items-center px-[95px]"
      data-name="Margin"
    >
      <div
        className="h-[24px] w-[2px] shrink-0 bg-[#cbd5e1]"
        data-name="Vertical Divider"
      />
    </div>
  );
}

function Container6() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[51.44px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">בניית הצעה</p>
      </div>
    </div>
  );
}

function NodeProjectDetails() {
  return (
    <div
      className="absolute top-[calc(50%-80px)] left-[414px] flex -translate-y-1/2 flex-col content-stretch items-center"
      data-name="Node: Project Details"
    >
      <BackgroundBorder2 />
      <Margin3 />
      <Container6 />
    </div>
  );
}

function Container7() {
  return (
    <div
      className="absolute top-[calc(50%-80px)] left-[366px] h-[5.625px] w-[14.203px] -translate-y-1/2"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14.2031 5.625"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p25bba940}
            fill="var(--fill-0, #CBD5E1)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#fff7ed] px-[18px] pt-[23.5px] pb-[24.5px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-[#f97316] border-solid"
      />
      <div
        className="absolute top-0 left-1/2 h-[96px] w-[192px] -translate-x-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[48px] w-[102.17px] shrink-0 flex-col justify-center whitespace-pre-wrap text-center font-['Assistant:Semi_Bold',sans-serif] text-[#f97316] text-[16px] not-italic leading-[24px]">
        <p className="mb-0">תצוגה מקדימה</p>
        <p>(דסקטופ/מובייל)</p>
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div
      className="relative flex h-[24px] w-[192px] shrink-0 flex-col content-stretch items-center px-[95px]"
      data-name="Margin"
    >
      <div
        className="h-[24px] w-[2px] shrink-0 bg-[#cbd5e1]"
        data-name="Vertical Divider"
      />
    </div>
  );
}

function Container8() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[53.23px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">בקרת איכות</p>
      </div>
    </div>
  );
}

function NodeQuotePreview() {
  return (
    <div
      className="absolute top-[calc(50%-80px)] left-[150px] flex -translate-y-1/2 flex-col content-stretch items-center"
      data-name="Node: Quote Preview"
    >
      <BackgroundBorder3 />
      <Margin4 />
      <Container8 />
    </div>
  );
}

function Container9() {
  return (
    <div
      className="absolute top-[calc(50%-80px)] left-[102px] h-[5.625px] w-[14.203px] -translate-y-1/2"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14.2031 5.625"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p25bba940}
            fill="var(--fill-0, #CBD5E1)"
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
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#f97316] px-[16px] pt-[35.5px] pb-[36.5px]"
      data-name="Background"
    >
      <div
        className="absolute top-0 left-1/2 h-[96px] w-[192px] -translate-x-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[24px] w-[118.83px] shrink-0 flex-col justify-center text-center font-['Assistant:Bold',sans-serif] font-bold text-[16px] text-white leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">קישור חיצוני ללקוח</p>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div
      className="relative flex h-[24px] w-[192px] shrink-0 flex-col content-stretch items-center px-[95px]"
      data-name="Margin"
    >
      <div
        className="h-[24px] w-[2px] shrink-0 bg-[#cbd5e1]"
        data-name="Vertical Divider"
      />
    </div>
  );
}

function Container10() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[60.78px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">חתימה ואישור</p>
      </div>
    </div>
  );
}

function NodeClientLink() {
  return (
    <div
      className="absolute top-[calc(50%+80px)] left-[942px] flex -translate-y-1/2 flex-col content-stretch items-center"
      data-name="Node: Client Link"
    >
      <Background />
      <Margin5 />
      <Container10 />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative h-[296px] w-full shrink-0" data-name="Container">
      <NodeDashboard />
      <Container3 />
      <NodeProjectsList />
      <Container5 />
      <NodeProjectDetails />
      <Container7 />
      <NodeQuotePreview />
      <Container9 />
      <NodeClientLink />
    </div>
  );
}

function SectionRow1ProjectsFlow() {
  return (
    <div
      className="relative w-full shrink-0"
      data-name="Section - Row 1 - Projects Flow"
    >
      <div className="relative flex w-full flex-col content-stretch items-start gap-[32px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Heading1 />
        <Container1 />
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div
      className="relative z-[1] flex h-[32px] w-[24px] shrink-0 flex-col content-stretch items-start pl-[12px]"
      data-name="Margin"
    >
      <div
        className="h-[32px] w-[12px] shrink-0 rounded-[9999px] bg-[#f97316]"
        data-name="Background"
      />
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 2">
      <div className="flex size-full flex-row items-center">
        <div className="relative isolate flex w-full content-stretch items-center pl-[873.59px]">
          <div className="relative z-[2] flex h-[28px] w-[236.41px] shrink-0 flex-col justify-center text-right font-['Assistant:Semi_Bold',sans-serif] text-[#1e293b] text-[20px] not-italic leading-[0]">
            <p className="whitespace-pre-wrap leading-[28px]">
              זרימת ניהול ספקים ומאגר מידע
            </p>
          </div>
          <Margin6 />
        </div>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#1e293b] px-[16px] pt-[23.5px] pb-[24.5px]"
      data-name="Background"
    >
      <div
        className="absolute top-0 left-1/2 h-[96px] w-[192px] -translate-x-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[48px] w-[103.86px] shrink-0 flex-col justify-center whitespace-pre-wrap text-center font-['Assistant:Semi_Bold',sans-serif] text-[16px] text-white not-italic leading-[24px]">
        <p className="mb-0">תאימות ומסמכים</p>
        <p>(Compliance)</p>
      </div>
    </div>
  );
}

function Margin7() {
  return (
    <div
      className="relative flex h-[24px] w-[192px] shrink-0 flex-col content-stretch items-center px-[95px]"
      data-name="Margin"
    >
      <div
        className="h-[24px] w-[2px] shrink-0 bg-[#cbd5e1]"
        data-name="Vertical Divider"
      />
    </div>
  );
}

function Container12() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[58.42px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">ניהול רגולציה</p>
      </div>
    </div>
  );
}

function NodeCompliance() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Node: Compliance"
    >
      <Background1 />
      <Margin7 />
      <Container12 />
    </div>
  );
}

function Container13() {
  return (
    <div
      className="relative h-[5.625px] w-[14.203px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14.2031 5.625"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p25bba940}
            fill="var(--fill-0, #CBD5E1)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-white px-[18px] pt-[35.5px] pb-[36.5px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-[#1e293b] border-solid"
      />
      <div
        className="absolute top-0 left-1/2 h-[96px] w-[192px] -translate-x-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[24px] w-[59.78px] shrink-0 flex-col justify-center text-center font-['Assistant:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">פרטי ספק</p>
      </div>
    </div>
  );
}

function Margin8() {
  return (
    <div
      className="relative flex h-[24px] w-[192px] shrink-0 flex-col content-stretch items-center px-[95px]"
      data-name="Margin"
    >
      <div
        className="h-[24px] w-[2px] shrink-0 bg-[#cbd5e1]"
        data-name="Vertical Divider"
      />
    </div>
  );
}

function Container14() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[44.91px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מידע כללי</p>
      </div>
    </div>
  );
}

function NodeSupplierDetail() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Node: Supplier Detail"
    >
      <BackgroundBorder4 />
      <Margin8 />
      <Container14 />
    </div>
  );
}

function Container15() {
  return (
    <div
      className="relative h-[5.625px] w-[14.203px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14.2031 5.625"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p25bba940}
            fill="var(--fill-0, #CBD5E1)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-white px-[18px] pt-[35.5px] pb-[36.5px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-[#1e293b] border-solid"
      />
      <div
        className="absolute top-0 left-1/2 h-[96px] w-[192px] -translate-x-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[24px] w-[67.17px] shrink-0 flex-col justify-center text-center font-['Assistant:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">בנק ספקים</p>
      </div>
    </div>
  );
}

function Margin9() {
  return (
    <div
      className="relative flex h-[24px] w-[192px] shrink-0 flex-col content-stretch items-center px-[95px]"
      data-name="Margin"
    >
      <div
        className="h-[24px] w-[2px] shrink-0 bg-[#cbd5e1]"
        data-name="Vertical Divider"
      />
    </div>
  );
}

function Container16() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[48.78px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">מאגר ראשי</p>
      </div>
    </div>
  );
}

function NodeSupplierBank() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Node: Supplier Bank"
    >
      <BackgroundBorder5 />
      <Margin9 />
      <Container16 />
    </div>
  );
}

function Container17() {
  return (
    <div
      className="relative h-[5.625px] w-[14.203px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14.2031 5.625"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p25bba940}
            fill="var(--fill-0, #CBD5E1)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder6() {
  return (
    <div
      className="relative flex h-[80px] w-[160px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#f1f5f9] p-[18px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-[#94a3b8] border-dashed"
      />
      <div className="relative flex h-[20px] w-[61.67px] shrink-0 flex-col justify-center text-center font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">תפריט צדדי</p>
      </div>
    </div>
  );
}

function NodeSideMenuTrigger() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Node: Side Menu (Trigger)"
    >
      <BackgroundBorder6 />
    </div>
  );
}

function Container11() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[24px] pl-[182px]">
          <NodeCompliance />
          <Container13 />
          <NodeSupplierDetail />
          <Container15 />
          <NodeSupplierBank />
          <Container17 />
          <NodeSideMenuTrigger />
        </div>
      </div>
    </div>
  );
}

function SectionRow2SuppliersFlow() {
  return (
    <div
      className="relative w-full shrink-0"
      data-name="Section - Row 2 - Suppliers Flow"
    >
      <div className="relative flex w-full flex-col content-stretch items-start gap-[32px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Heading2 />
        <Container11 />
      </div>
    </div>
  );
}

function Margin10() {
  return (
    <div
      className="relative z-[1] flex h-[32px] w-[24px] shrink-0 flex-col content-stretch items-start pl-[12px]"
      data-name="Margin"
    >
      <div
        className="h-[32px] w-[12px] shrink-0 rounded-[9999px] bg-[#f97316]"
        data-name="Background"
      />
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative w-full shrink-0" data-name="Heading 2">
      <div className="flex size-full flex-row items-center">
        <div className="relative isolate flex w-full content-stretch items-center pl-[885.95px]">
          <div className="relative z-[2] flex h-[28px] w-[224.05px] shrink-0 flex-col justify-center text-right font-['Assistant:Semi_Bold',sans-serif] text-[#1e293b] text-[20px] not-italic leading-[0]">
            <p className="whitespace-pre-wrap leading-[28px]">
              תהליך ייבוא וסריקה אוטומטית
            </p>
          </div>
          <Margin10 />
        </div>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#f97316] px-[16px] pt-[23.5px] pb-[24.5px]"
      data-name="Background"
    >
      <div
        className="absolute top-0 left-1/2 h-[96px] w-[192px] -translate-x-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[48px] w-[149.55px] shrink-0 flex-col justify-center whitespace-pre-wrap text-center font-['Assistant:Bold',sans-serif] font-bold text-[16px] text-white leading-[24px]">
        <p className="mb-0">סריקת אתר</p>
        <p>(Suggested Products)</p>
      </div>
    </div>
  );
}

function Margin11() {
  return (
    <div
      className="relative flex h-[24px] w-[192px] shrink-0 flex-col content-stretch items-center px-[95px]"
      data-name="Margin"
    >
      <div
        className="h-[24px] w-[2px] shrink-0 bg-[#cbd5e1]"
        data-name="Vertical Divider"
      />
    </div>
  );
}

function Container19() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[68.64px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">הצעות למוצרים</p>
      </div>
    </div>
  );
}

function NodeSiteScan() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Node: Site Scan"
    >
      <Background2 />
      <Margin11 />
      <Container19 />
    </div>
  );
}

function Container20() {
  return (
    <div
      className="relative h-[5.625px] w-[14.203px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14.2031 5.625"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p25bba940}
            fill="var(--fill-0, #CBD5E1)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder7() {
  return (
    <div
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-white px-[18px] pt-[23.5px] pb-[24.5px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-[#1e293b] border-solid"
      />
      <div
        className="absolute top-0 left-1/2 h-[96px] w-[192px] -translate-x-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[48px] w-[100.8px] shrink-0 flex-col justify-center whitespace-pre-wrap text-center font-['Assistant:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[24px]">
        <p className="mb-0">אשף סיווג</p>
        <p>(Classification)</p>
      </div>
    </div>
  );
}

function Margin12() {
  return (
    <div
      className="relative flex h-[24px] w-[192px] shrink-0 flex-col content-stretch items-center px-[95px]"
      data-name="Margin"
    >
      <div
        className="h-[24px] w-[2px] shrink-0 bg-[#cbd5e1]"
        data-name="Vertical Divider"
      />
    </div>
  );
}

function Container21() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[38.72px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">תיוג חכם</p>
      </div>
    </div>
  );
}

function NodeClassification() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Node: Classification"
    >
      <BackgroundBorder7 />
      <Margin12 />
      <Container21 />
    </div>
  );
}

function Container22() {
  return (
    <div
      className="relative h-[5.625px] w-[14.203px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14.2031 5.625"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p25bba940}
            fill="var(--fill-0, #CBD5E1)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder8() {
  return (
    <div
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-white px-[18px] pt-[23.5px] pb-[24.5px]"
      data-name="Background+Border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-[#1e293b] border-solid"
      />
      <div
        className="absolute top-0 left-1/2 h-[96px] w-[192px] -translate-x-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
        data-name="Overlay+Shadow"
      />
      <div className="relative flex h-[48px] w-[106.38px] shrink-0 flex-col justify-center whitespace-pre-wrap text-center font-['Assistant:Semi_Bold',sans-serif] text-[#1e293b] text-[16px] not-italic leading-[24px]">
        <p className="mb-0">אשף ייבוא</p>
        <p>(Import Wizard)</p>
      </div>
    </div>
  );
}

function Margin13() {
  return (
    <div
      className="relative flex h-[24px] w-[192px] shrink-0 flex-col content-stretch items-center px-[95px]"
      data-name="Margin"
    >
      <div
        className="h-[24px] w-[2px] shrink-0 bg-[#cbd5e1]"
        data-name="Vertical Divider"
      />
    </div>
  );
}

function Container23() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[16px] w-[63.45px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#94a3b8] text-[12px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[16px]">העלאת נתונים</p>
      </div>
    </div>
  );
}

function NodeImportWizard() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-center"
      data-name="Node: Import Wizard"
    >
      <BackgroundBorder8 />
      <Margin13 />
      <Container23 />
    </div>
  );
}

function Container24() {
  return (
    <div
      className="relative h-[5.625px] w-[14.203px] shrink-0"
      data-name="Container"
    >
      <svg
        className="absolute inset-0 block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14.2031 5.625"
      >
        <title>Decorative icon</title>
        <g id="Container">
          <path
            d={svgPaths.p25bba940}
            fill="var(--fill-0, #CBD5E1)"
            id="Icon"
          />
        </g>
      </svg>
    </div>
  );
}

function StartPointFromSupplierBank() {
  return (
    <div
      className="relative flex h-[96px] w-[192px] shrink-0 content-stretch items-center justify-center rounded-[8px] bg-[#1e293b] px-[16px] pt-[35.5px] pb-[36.5px]"
      data-name="Start point from Supplier Bank"
    >
      <div
        className="absolute top-1/2 left-0 h-[96px] w-[192px] -translate-y-1/2 rounded-[8px] bg-[rgba(255,255,255,0)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        data-name="Start point from Supplier Bank:shadow"
      />
      <div className="relative flex h-[24px] w-[94.47px] shrink-0 flex-col justify-center text-center font-['Assistant:Bold',sans-serif] font-bold text-[16px] text-white leading-[0]">
        <p className="whitespace-pre-wrap leading-[24px]">ייבוא ספק חדש</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative w-full shrink-0" data-name="Container">
      <div className="flex size-full flex-row items-center">
        <div className="relative flex w-full content-stretch items-center gap-[24px] pl-[150px]">
          <NodeSiteScan />
          <Container20 />
          <NodeClassification />
          <Container22 />
          <NodeImportWizard />
          <Container24 />
          <StartPointFromSupplierBank />
        </div>
      </div>
    </div>
  );
}

function SectionRow3AutomationImport() {
  return (
    <div
      className="relative w-full shrink-0"
      data-name="Section - Row 3 - Automation & Import"
    >
      <div className="relative flex w-full flex-col content-stretch items-start gap-[32px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Heading3 />
        <Container18 />
      </div>
    </div>
  );
}

function MainDiagramContainer() {
  return (
    <div
      className="relative w-full max-w-[1280px] shrink-0 rounded-[12px]"
      data-name="Main - Diagram Container"
      style={{
        backgroundImage:
          "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1216 1002\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(85.984 0 0 70.852 608 501)\\'><stop stop-color=\\'rgba(203,213,225,1)\\' offset=\\'0.029463\\'/><stop stop-color=\\'rgba(203,213,225,0)\\' offset=\\'0.029463\\'/></radialGradient></defs></svg>')",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e2e8f0] border-solid shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      />
      <div className="relative flex w-full max-w-[inherit] flex-col content-stretch items-start gap-[80px] p-[41px]">
        <SectionRow1ProjectsFlow />
        <SectionRow2SuppliersFlow />
        <SectionRow3AutomationImport />
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
      <div className="relative flex h-[20px] w-[84.7px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">מסכים תפעוליים</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Container">
      <div className="relative flex h-full content-stretch items-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container26 />
        <div
          className="relative size-[16px] shrink-0 rounded-[4px] bg-white"
          data-name="Background+Border"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[4px] border border-[#1e293b] border-solid"
          />
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[103px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">
          יציאה חיצונית / קצה
        </p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Container">
      <div className="relative flex h-full content-stretch items-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container28 />
        <div
          className="size-[16px] shrink-0 rounded-[4px] bg-[#f97316]"
          data-name="Background"
        />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div
      className="relative flex shrink-0 flex-col content-stretch items-end"
      data-name="Container"
    >
      <div className="relative flex h-[20px] w-[53.72px] shrink-0 flex-col justify-center text-right font-['Assistant:Regular',sans-serif] font-normal text-[#475569] text-[14px] leading-[0]">
        <p className="whitespace-pre-wrap leading-[20px]">מסכי ליבה</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0 self-stretch" data-name="Container">
      <div className="relative flex h-full content-stretch items-center gap-[8px] border-0 border-[transparent] border-solid bg-clip-padding">
        <Container30 />
        <div
          className="size-[16px] shrink-0 rounded-[4px] bg-[#1e293b]"
          data-name="Background"
        />
      </div>
    </div>
  );
}

function FooterLegend() {
  return (
    <div
      className="relative w-full max-w-[1280px] shrink-0 rounded-[8px] bg-white"
      data-name="Footer - Legend"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[8px] border border-[#e2e8f0] border-solid"
      />
      <div className="flex size-full max-w-[inherit] flex-row justify-center">
        <div className="relative flex w-full max-w-[inherit] content-stretch items-start justify-center gap-[32px] p-[25px]">
          <Container25 />
          <Container27 />
          <Container29 />
        </div>
      </div>
    </div>
  );
}

export default function GeneratedScreen() {
  return (
    <div
      className="relative flex size-full flex-col content-stretch items-start gap-[48px] bg-[#f8fafc] p-[32px]"
      data-name="Generated Screen"
    >
      <PageHeader />
      <MainDiagramContainer />
      <FooterLegend />
    </div>
  );
}
