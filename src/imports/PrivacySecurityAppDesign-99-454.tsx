import svgPaths from "./svg-ymhrg31ejm";

function Opps() {
  return <div className="absolute h-[1024px] left-[0.5px] top-0 w-[405px]" data-name="OPPS" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 405 1024\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -87.036 -89.922 0 101.25 204.8)\'><stop stop-color=\'rgba(255,220,230,0.6)\' offset=\'0\'/><stop stop-color=\'rgba(191,165,173,0.45)\' offset=\'0.15\'/><stop stop-color=\'rgba(128,110,115,0.3)\' offset=\'0.3\'/><stop stop-color=\'rgba(64,55,58,0.15)\' offset=\'0.45\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.6\'/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 405 1024\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -77.475 -80.044 0 303.75 307.2)\'><stop stop-color=\'rgba(230,210,240,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(173,158,180,0.375)\' offset=\'0.15\'/><stop stop-color=\'rgba(115,105,120,0.25)\' offset=\'0.3\'/><stop stop-color=\'rgba(58,53,60,0.125)\' offset=\'0.45\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.6\'/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 405 1024\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -74.311 -76.776 0 202.5 716.8)\'><stop stop-color=\'rgba(200,240,220,0.4)\' offset=\'0\'/><stop stop-color=\'rgba(150,180,165,0.3)\' offset=\'0.15\'/><stop stop-color=\'rgba(100,120,110,0.2)\' offset=\'0.3\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.6\'/></radialGradient></defs></svg>'), linear-gradient(111.579deg, rgb(255, 232, 240) 0%, rgb(248, 240, 251) 50%, rgb(240, 250, 245) 100%)" }} />;
}

function Heading() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Nunito:SemiBold',sans-serif] font-semibold leading-[40px] left-0 text-[#8b7a7f] text-[32px] top-0 tracking-[-0.4px]">Hi, User</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Nunito:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#b5a5aa] text-[16px] top-0">How is your heart today?</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] h-[70px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1f26180} id="Vector" stroke="var(--stroke-0, #8B7A7F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3ae7e920} id="Vector_2" stroke="var(--stroke-0, #8B7A7F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] relative rounded-[16777200px] shrink-0 size-[48px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.6)] border-solid inset-0 pointer-events-none rounded-[16777200px] shadow-[0px_2px_8px_0px_rgba(194,167,184,0.15)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex h-[70px] items-start justify-between left-[24px] top-[64px] w-[344px]" data-name="Container">
      <Container3 />
      <Button />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex h-[26px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Nunito:SemiBold',sans-serif] font-semibold leading-[26px] min-h-px min-w-px relative text-[#8b7a7f] text-[19px] whitespace-pre-wrap">AI Guardian Presence</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[21px] left-0 text-[#a5949a] text-[14px] top-0" style={{ fontVariationSettings: "'opsz' 9" }}>
        Someone is with you now
      </p>
    </div>
  );
}

function Container9() {
  return <div className="bg-[rgba(165,148,154,0.4)] rounded-[16777200px] shrink-0 size-[8px]" data-name="Container" />;
}

function Text() {
  return (
    <div className="h-[16px] relative shrink-0 w-[65.555px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#b5a5aa] text-[12px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          On standby
        </p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[8px] h-[16px] items-center relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Text />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[79px] items-start left-[80px] top-0 w-[213px]" data-name="Container">
      <Heading1 />
      <Paragraph1 />
      <Container8 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[28.829px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.8291 28.8291">
        <g clipPath="url(#clip0_99_464)" id="Icon">
          <path d={svgPaths.p74c6100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="2.16218" />
          <path d="M14.4146 12.0121V16.817" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="2.40243" />
        </g>
        <defs>
          <clipPath id="clip0_99_464">
            <rect fill="white" height="28.8291" width="28.8291" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[-0.95px] rounded-[16777200px] shadow-[0px_7.184px_28.738px_0px_rgba(194,167,184,0.41)] size-[65.895px] top-[-0.95px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(159, 183, 164) 0%, rgb(214, 180, 184) 70%, rgb(232, 200, 204) 100%)" }}>
      <Icon1 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_6px_0px_rgba(255,255,255,0.56)]" />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[79px] left-[25.5px] top-[25.5px] w-[293px]" data-name="Container">
      <Container7 />
      <Container10 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[52px] left-[25.5px] rounded-[16777200px] shadow-[0px_4px_16px_0px_rgba(194,167,184,0.3)] top-[124.5px] w-[293px]" data-name="Button" style={{ backgroundImage: "linear-gradient(169.936deg, rgb(194, 167, 184) 0%, rgb(214, 180, 184) 100%)" }}>
      <p className="-translate-x-1/2 absolute font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[20px] left-[147.39px] text-[15px] text-center text-white top-[15.5px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Activate Guardian
      </p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[16px] left-[25.5px] top-[188.5px] w-[293px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[16px] left-[146.88px] text-[#b5a5aa] text-[11px] text-center top-[-0.5px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Tap to simulate a safe presence
      </p>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[74.648px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#b5a5aa] text-[12px] text-center" style={{ fontVariationSettings: "'opsz' 14" }}>
          More options
        </p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #B5A5AA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-center left-[25.5px] pr-[0.008px] top-[220.5px] w-[293px]" data-name="Button">
      <Text1 />
      <Icon2 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[278px] relative rounded-[24px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(141.057deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 245, 250, 0.9) 100%)" }}>
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(255,255,255,0.6)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_8px_32px_0px_rgba(194,167,184,0.18)]" />
      <Container6 />
      <Button1 />
      <Paragraph2 />
      <Button2 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_2px_0px_rgba(255,255,255,0.9)]" />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p3b3c7300} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative rounded-[16777200px] shadow-[0px_4px_16px_0px_rgba(226,198,196,0.3)] shrink-0 size-[56px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(226, 198, 196) 0%, rgb(202, 170, 166) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon3 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[21px] left-[59px] text-[#8b7a8f] text-[15px] text-center top-[-0.5px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Photo Privacy
      </p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[18px] left-[59px] text-[#a5949a] text-[13px] text-center top-[0.5px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Secure your photos
      </p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[43px] relative shrink-0 w-[117.773px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading2 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[121px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] col-[1] justify-self-stretch relative rounded-[18px] row-[1] self-stretch shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(255,255,255,0.9)] border-solid inset-0 pointer-events-none rounded-[18px] shadow-[0px_4px_16px_0px_rgba(139,122,143,0.1)]" />
      <div className="content-stretch flex flex-col items-start pb-[1.5px] pt-[21.5px] px-[21.5px] relative size-full">
        <Container12 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3ae4c900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.36" />
          <path d={svgPaths.p1998dc40} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.36" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative rounded-[16777200px] shadow-[0px_4px_16px_0px_rgba(159,183,164,0.3)] shrink-0 size-[56px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(159, 183, 164) 0%, rgb(141, 168, 149) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon4 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[21px] left-[55.82px] text-[#8b7a8f] text-[15px] text-center top-[-0.5px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Evidence Vault
      </p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[18px] left-[56px] text-[#a5949a] text-[13px] text-center top-[0.5px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Encrypted storage
      </p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[43px] relative shrink-0 w-[111.508px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[124px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Container17 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] col-[2] justify-self-stretch relative rounded-[18px] row-[1] self-stretch shadow-[0px_4px_16px_0px_rgba(139,122,143,0.1)] shrink-0" data-name="Button">
      <div className="content-stretch flex flex-col items-start pt-[20px] px-[20px] relative size-full">
        <Container15 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

function Container11() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[164px] relative shrink-0 w-full" data-name="Container">
      <Button3 />
      <Button4 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[18px] left-[4px] text-[#9b8ba5] text-[13px] top-[0.5px] tracking-[0.5px] uppercase" style={{ fontVariationSettings: "'opsz' 14" }}>{`Wellness & Support`}</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_86_231)" id="Icon">
          <path d={svgPaths.p3dfb7600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.41667" />
          <path d={svgPaths.pec9c4c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.41667" />
          <path d={svgPaths.p10c17e40} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.41667" />
          <path d={svgPaths.p24333a80} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.41667" />
        </g>
        <defs>
          <clipPath id="clip0_86_231">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative rounded-[16777200px] shadow-[0px_4px_16px_0px_rgba(226,198,196,0.25)] shrink-0 size-[48px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(226, 198, 196) 0%, rgb(202, 170, 166) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon5 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[22px] left-0 text-[#8b7a8f] text-[16px] top-[0.5px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Safe Conversations
      </p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[19px] left-0 text-[#a5949a] text-[13px] top-0" style={{ fontVariationSettings: "'opsz' 9" }}>
        Practice setting boundaries
      </p>
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[1_0_0] h-[43px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading5 />
        <Paragraph5 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #A5949A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[48px] items-center left-[20px] top-[20px] w-[304px]" data-name="Container">
      <Container20 />
      <Container21 />
      <Icon6 />
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[rgba(255,255,255,0.7)] h-[88px] relative rounded-[18px] shadow-[0px_4px_16px_0px_rgba(139,122,143,0.1)] shrink-0 w-full" data-name="Button">
      <Container19 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p23a0100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.41667" />
          <path d={svgPaths.pa632700} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.41667" />
          <path d="M2.30554 17.0417H15.1389" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.41667" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative rounded-[16777200px] shadow-[0px_4px_16px_0px_rgba(159,183,164,0.25)] shrink-0 size-[48px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(159, 183, 164) 0%, rgb(141, 168, 149) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon7 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[22px] left-0 text-[#8b7a8f] text-[16px] top-[0.5px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        MyLayak Aid
      </p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[19px] left-0 text-[#a5949a] text-[13px] top-0" style={{ fontVariationSettings: "'opsz' 9" }}>
        Financial assistance programs
      </p>
    </div>
  );
}

function Container24() {
  return (
    <div className="flex-[1_0_0] h-[43px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading6 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #A5949A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[48px] items-center left-[20px] top-[20px] w-[304px]" data-name="Container">
      <Container23 />
      <Container24 />
      <Icon8 />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[rgba(255,255,255,0.7)] h-[88px] relative rounded-[18px] shadow-[0px_4px_16px_0px_rgba(139,122,143,0.1)] shrink-0 w-full" data-name="Button">
      <Container22 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[234px] items-start pt-[16px] relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Button5 />
      <Button6 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2de00380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative rounded-[16777200px] shadow-[0px_4px_12px_0px_rgba(226,198,196,0.2)] shrink-0 size-[44px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(226, 198, 196) 0%, rgb(202, 170, 166) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon9 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[21px] left-0 text-[#8b7a8f] text-[15px] top-[-0.5px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Daily Wellness Tip
      </p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[21px] left-0 text-[#a5949a] text-[13px] top-0 w-[231px] whitespace-pre-wrap" style={{ fontVariationSettings: "'opsz' 9" }}>{`Take a few deep breaths today. Remember, you're doing great and you deserve care.`}</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="flex-[1_0_0] h-[90px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Heading7 />
        <Paragraph7 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex gap-[16px] h-[90px] items-start relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Container28 />
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-[rgba(255,250,250,0.7)] h-[130px] relative rounded-[18px] shadow-[0px_4px_16px_0px_rgba(226,198,196,0.12)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pt-[20px] px-[20px] relative size-full">
        <Container26 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.7)]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] h-[866px] items-start left-0 px-[24px] top-[158px] w-[392px]" data-name="Container">
      <Container5 />
      <Container11 />
      <Container18 />
      <Container25 />
    </div>
  );
}

function SecureDashboard() {
  return (
    <div className="h-[1024px] overflow-clip relative shrink-0 w-[420px]" data-name="SecureDashboard">
      <Opps />
      <Container2 />
      <Container4 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[904px] relative shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[10px] relative size-full">
          <SecureDashboard />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-white h-[932px] left-[248.5px] rounded-[60px] top-[16px] w-[430px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[14px] relative rounded-[inherit] size-full">
        <Container1 />
      </div>
      <div aria-hidden="true" className="absolute border-14 border-[#101828] border-solid inset-0 pointer-events-none rounded-[60px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function App() {
  return (
    <div className="bg-[#f3f4f6] h-[964px] relative shrink-0 w-full" data-name="App">
      <Container />
    </div>
  );
}

export default function PrivacySecurityAppDesign() {
  return (
    <div className="bg-[#faf8f6] content-stretch flex flex-col items-start relative size-full" data-name="Privacy Security App Design">
      <App />
    </div>
  );
}