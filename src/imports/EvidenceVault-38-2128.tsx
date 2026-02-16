import svgPaths from "./svg-nhtn89mb9x";

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M12 19V22" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p1fc92080} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p18608f80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[28px] relative shrink-0 w-[104.283px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Nunito:Regular',sans-serif] font-normal leading-[28px] left-[52.5px] text-[18px] text-center text-white top-[-0.37px]">Panic Record</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[28px] items-center justify-center left-0 top-[10px] w-[366px]" data-name="Container">
      <Icon />
      <Text />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-gradient-to-r from-[#7a2e2e] h-[49px] relative rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] shrink-0 to-[rgba(122,46,46,0.9)] w-full" data-name="Button">
      <Container />
    </div>
  );
}

export default function EvidenceVault() {
  return (
    <div className="bg-[#1e1f23] content-stretch flex flex-col items-start pt-[24px] px-[24px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] size-full" data-name="EvidenceVault">
      <Button />
    </div>
  );
}