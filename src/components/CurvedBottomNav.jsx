import React from 'react';

export default function CurvedBottomNav({ tabs, activeTab, onSelectTab }) {
  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  // ViewBox coordinates (400px width, 56px height)
  const numTabs = Math.max(1, tabs.length);
  const tabWidth = 400 / numTabs;
  const padding = Math.min(16, tabWidth * 0.12);
  const leftX = safeIndex * tabWidth + padding;
  const rightX = (safeIndex + 1) * tabWidth - padding;
  const Y0 = 3;  // Top horizontal border line
  const Y1 = 48; // Dip down to bottom of navbar
  const r = 6;   // Crisp 90-degree rounded corner radius ("bo cong vuông vức")

  // Slender 1.8px SVG Continuous Stroke Path: Crisp rectangular notch with 6px rounded corners
  const strokePath = `
    M 0 ${Y0}
    L ${leftX - r} ${Y0}
    Q ${leftX} ${Y0}, ${leftX} ${Y0 + r}
    L ${leftX} ${Y1 - r}
    Q ${leftX} ${Y1}, ${leftX + r} ${Y1}
    L ${rightX - r} ${Y1}
    Q ${rightX} ${Y1}, ${rightX} ${Y1 - r}
    L ${rightX} ${Y0 + r}
    Q ${rightX} ${Y0}, ${rightX + r} ${Y0}
    L 400 ${Y0}
  `;

  // Cream Grid Fill Path inside the active notch
  const activeGridFillPath = `
    M ${leftX} ${Y0 + r}
    L ${leftX} ${Y1 - r}
    Q ${leftX} ${Y1}, ${leftX + r} ${Y1}
    L ${rightX - r} ${Y1}
    Q ${rightX} ${Y1}, ${rightX} ${Y1 - r}
    L ${rightX} ${Y0 + r}
    Z
  `;

  return (
    <nav className="w-full bg-grid-notebook shrink-0 z-40 relative select-none">
      {/* SVG Slender 1.8px Curve Line Overlay */}
      <svg
        viewBox="0 0 400 56"
        preserveAspectRatio="none"
        className="w-full h-[56px] absolute top-0 left-0 pointer-events-none z-10 overflow-visible"
      >
        {/* Cream Active Tab Background (#FAF6ED) - Seamless with notebook grid */}
        <path
          d={activeGridFillPath}
          fill="#FAF6ED"
          className="transition-all duration-300 ease-out"
        />

        {/* Continuous Slender 1.8px Black Stroke Line */}
        <path
          d={strokePath}
          fill="none"
          stroke="#18181B"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>

      {/* Interactive Tab Buttons Layer */}
      <div className="w-full h-[54px] flex items-center justify-between relative z-20 px-1 pt-1 pb-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center transition-all duration-200 py-1 ${
                isActive ? 'translate-y-0.5' : 'opacity-75 hover:opacity-100'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform ${
                  isActive ? 'text-slate-900 stroke-[2.2] scale-110' : 'text-slate-700 stroke-[1.8]'
                }`}
              />
              <span
                className={`text-[9px] mt-0.5 tracking-tight ${
                  isActive ? 'font-black uppercase text-slate-900' : 'font-bold text-slate-700'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
