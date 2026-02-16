import svgPaths from "./svg-yuiklwsc3n";
import imgContainer from "figma:asset/b9295fed79b66df1cd88744654b962a3acba64b6.png";

function Container5() {
  return (
    <div className="relative shrink-0 size-[56px]" data-name="Container">
      <div className="absolute inset-[-21.43%_-28.57%_-35.71%_-28.57%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 88 88">
          <g filter="url(#filter0_di_81_139)" id="Container">
            <path d={svgPaths.p2131eb00} fill="url(#paint0_linear_81_139)" shapeRendering="crispEdges" />
            <path d={svgPaths.p1cb32200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.65" />
            <path d={svgPaths.p1f15cf00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.65" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="88" id="filter0_di_81_139" width="88" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="8" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.623529 0 0 0 0 0.717647 0 0 0 0 0.643137 0 0 0 0.3 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_81_139" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_81_139" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
              <feBlend in2="shape" mode="normal" result="effect2_innerShadow_81_139" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_81_139" x1="16" x2="72" y1="12" y2="68">
              <stop stopColor="#AAB8AB" />
              <stop offset="1" stopColor="#7B9B85" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[24px] left-0 top-[11px] w-[188px]" data-name="Heading 3">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[24px] left-0 text-[#4a4552] text-[17px] top-[-0.33px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Walk With Me
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[40px] left-[4px] top-[23px] w-[188px]" data-name="Paragraph">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[20px] left-[-3px] text-[#6a6770] text-[14px] top-[13px] w-[201px] whitespace-pre-wrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        Your caring safety companion
      </p>
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] h-[66px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Heading1 />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M7.5 15L12.5 10L7.5 5" id="Vector" stroke="var(--stroke-0, #8A8694)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[66px] items-center left-[24px] top-[24px] w-[306px]" data-name="Container">
      <Container5 />
      <Container6 />
      <Icon />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(255,255,255,0.85)] h-[114px] relative rounded-[20px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.06)] shrink-0 w-full" data-name="Button">
      <Container4 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col h-[122px] items-start pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Button />
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[23px] relative shrink-0 w-[30px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 23">
        <g id="Frame">
          <path d={svgPaths.p35296a00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative rounded-[22369600px] shadow-[0px_4px_16px_0px_rgba(226,198,196,0.3)] shrink-0 size-[56px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(226, 198, 196) 0%, rgb(202, 174, 170) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Frame />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[21px] left-[58.84px] text-[#4a4552] text-[15px] text-center top-[-0.33px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Photo Privacy
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[18px] left-[59px] text-[#6a6770] text-[13px] text-center top-[0.67px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Secure your photos
      </p>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[43px] relative shrink-0 w-[117.469px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading2 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[124px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container10 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.8)] content-stretch flex flex-col items-start left-0 pt-[20px] px-[20px] rounded-[18px] size-[164px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.5px] border-solid border-white inset-0 pointer-events-none rounded-[18px] shadow-[0px_6px_24px_0px_rgba(0,0,0,0.05)]" />
      <Container8 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute h-[30px] left-[16px] top-[12.5px] w-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 30">
        <g id="Icon">
          <path d={svgPaths.pda790f0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.7" />
          <path d={svgPaths.p2efff90} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.7" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative rounded-[22369600px] shadow-[0px_4px_16px_0px_rgba(159,183,164,0.3)] shrink-0 size-[56px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(159, 183, 164) 0%, rgb(141, 168, 149) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[21px] left-[55.67px] text-[#4a4552] text-[15px] text-center top-[-0.33px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Evidence Vault
      </p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[18px] left-[56px] text-[#6a6770] text-[13px] text-center top-[0.67px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Encrypted storage
      </p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[43px] relative shrink-0 w-[111.198px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading3 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[124px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <Container13 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.8)] content-stretch flex flex-col items-start left-[180px] pt-[20px] px-[20px] rounded-[18px] shadow-[0px_6px_24px_0px_rgba(0,0,0,0.05)] size-[164px] top-0" data-name="Button">
      <Container11 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[164px] relative shrink-0 w-full" data-name="Container">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[18px] left-[4px] text-[#63606b] text-[13px] top-[0.67px] tracking-[0.5px] uppercase" style={{ fontVariationSettings: "'opsz' 14" }}>{`Wellness & Support`}</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_81_129)" id="Icon">
          <path d={svgPaths.p3dfb7600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.41667" />
          <path d={svgPaths.pec9c4c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.41667" />
          <path d={svgPaths.p10c17e40} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.41667" />
          <path d={svgPaths.p24333a80} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.41667" />
        </g>
        <defs>
          <clipPath id="clip0_81_129">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative rounded-[22369600px] shadow-[0px_4px_16px_0px_rgba(226,198,196,0.25)] shrink-0 size-[48px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(226, 198, 196) 0%, rgb(202, 174, 170) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[22px] left-0 text-[#4a4552] text-[16px] top-[0.67px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Safe Conversations
      </p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[19px] left-0 text-[#6a6770] text-[13px] top-[-0.33px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Practice setting boundaries
      </p>
    </div>
  );
}

function Container17() {
  return (
    <div className="flex-[1_0_0] h-[43px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading5 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #8A8694)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[48px] items-center left-[20px] top-[20px] w-[304px]" data-name="Container">
      <Container16 />
      <Container17 />
      <Icon3 />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[rgba(255,255,255,0.68)] h-[88px] relative rounded-[18px] shadow-[0px_6px_24px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Button">
      <Container15 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

function Icon4() {
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

function Container19() {
  return (
    <div className="relative rounded-[22369600px] shadow-[0px_4px_16px_0px_rgba(159,183,164,0.25)] shrink-0 size-[48px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(159, 183, 164) 0%, rgb(141, 168, 149) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon4 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[22px] left-0 text-[#4a4552] text-[16px] top-[0.67px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        MyLayak Aid
      </p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[19px] left-0 text-[#6a6770] text-[13px] top-[-0.33px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Financial assistance programs
      </p>
    </div>
  );
}

function Container20() {
  return (
    <div className="flex-[1_0_0] h-[43px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading6 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #8A8694)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[48px] items-center left-[20px] top-[20px] w-[304px]" data-name="Container">
      <Container19 />
      <Container20 />
      <Icon5 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[rgba(255,255,255,0.68)] h-[88px] relative rounded-[18px] shadow-[0px_6px_24px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Button">
      <Container18 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[234px] items-start pt-[16px] relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function Icon6() {
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

function Container23() {
  return (
    <div className="relative rounded-[22369600px] shadow-[0px_4px_12px_0px_rgba(226,198,196,0.2)] shrink-0 size-[44px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(226, 198, 196) 0%, rgb(202, 174, 170) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon6 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[21px] left-0 text-[#4a4552] text-[15px] top-[-0.33px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Daily Wellness Tip
      </p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[21px] left-0 text-[13px] text-[rgba(106,103,112,0.85)] top-[-0.33px] w-[221px] whitespace-pre-wrap" style={{ fontVariationSettings: "'opsz' 9" }}>{`Take a few deep breaths today. Remember, you're doing great and you deserve care.`}</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="flex-[1_0_0] h-[90px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Heading7 />
        <Paragraph5 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[16px] h-[90px] items-start relative shrink-0 w-full" data-name="Container">
      <Container23 />
      <Container24 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[130px] relative rounded-[18px] shadow-[0px_4px_20px_0px_rgba(226,198,196,0.08)] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(159.298deg, rgba(255, 250, 248, 0.65) 0%, rgba(255, 248, 245, 0.6) 100%)" }}>
      <div className="content-stretch flex flex-col items-start pt-[20px] px-[20px] relative size-full">
        <Container22 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.7)]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] h-[922px] items-start left-0 px-[24px] top-[140px] w-[392px]" data-name="Container">
      <Container3 />
      <Container7 />
      <Container14 />
      <Container21 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Nunito:SemiBold',sans-serif] leading-[40px] left-0 not-italic text-[#4a4552] text-[32px] top-[-0.33px] tracking-[-0.4px]">Hi, User</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Nunito:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#6a6770] text-[16px] top-[0.33px]">How is your heart today?</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="flex-[1_0_0] h-[70px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Heading />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Button">
      <div className="absolute inset-[-25%_-33.33%_-41.67%_-33.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 80">
          <g filter="url(#filter0_di_81_124)" id="Button">
            <path d={svgPaths.p3171f880} fill="var(--fill-0, white)" fillOpacity="0.6" shapeRendering="crispEdges" />
            <path d={svgPaths.p1df27dc0} shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeOpacity="0.8" strokeWidth="0.5" />
            <g id="Icon">
              <path d={svgPaths.pffd2280} id="Vector" stroke="var(--stroke-0, #5A5762)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
            <path d={svgPaths.p51ee200} id="Vector_2" stroke="var(--stroke-0, #5A5762)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="80" id="filter0_di_81_124" width="80" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="8" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_81_124" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_81_124" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
              <feBlend in2="shape" mode="normal" result="effect2_innerShadow_81_124" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex h-[70px] items-start justify-between left-[24px] top-[64px] w-[344px]" data-name="Container">
      <Container26 />
      <Button5 />
    </div>
  );
}

function SecureDashboard() {
  return (
    <div className="h-[897px] overflow-clip relative shrink-0 w-[402px]" data-name="SecureDashboard">
      <Container2 />
      <Container25 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col h-[919px] items-start overflow-clip pr-[10px] relative shrink-0 w-[392px]" data-name="Container">
      <SecureDashboard />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[955px] left-[457px] rounded-[60px] top-[16px] w-[424px]" data-name="Container">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[60px]">
        <img alt="" className="absolute h-full left-[-174.31%] max-w-none top-[-1.01%] w-[325.12%]" src={imgContainer} />
      </div>
      <div className="content-stretch flex flex-col items-start overflow-clip p-[14px] relative rounded-[inherit] size-full">
        <Container1 />
      </div>
      <div aria-hidden="true" className="absolute border-14 border-[#101828] border-solid inset-0 pointer-events-none rounded-[60px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function App() {
  return (
    <div className="bg-[#313131] h-[1285px] relative shrink-0 w-full" data-name="App">
      <Container />
      <div className="absolute h-[24.375px] left-0 top-[1285px] w-[18px]" data-name="Vector">
        <div className="absolute inset-[-3.38%_-4.58%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.65 26.0247">
            <path d={svgPaths.p19545700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.65" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[7.313px] left-[6px] top-[1291px] w-[6.75px]" data-name="Vector">
        <div className="absolute inset-[-11.28%_-12.22%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.4 8.9625">
            <path d={svgPaths.p20e65f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.65" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[7.313px] left-0 top-[1309.37px] w-[6.75px]" data-name="Vector">
        <div className="absolute inset-[-11.28%_-12.22%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.4 8.9625">
            <path d={svgPaths.p20e65f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" strokeWidth="1.65" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function PrivacySecurityAppDesign() {
  return (
    <div className="bg-[#949494] content-stretch flex flex-col items-start relative size-full" data-name="Privacy Security App Design">
      <App />
    </div>
  );
}