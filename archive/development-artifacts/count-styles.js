const fs = require("fs");
const files = [
  "./frontend/src/App.tsx",
  "./frontend/src/components/GlobalNav.tsx",
  "./frontend/src/components/CampaignForm.tsx",
  "./frontend/src/components/AgentsPage.tsx",
];

let totalInline = 0,
  totalClass = 0,
  totalAll = 0;

console.log("File\t\tInline Styles\tCSS Classes\t% Inline\t% CSS");
files.forEach((file) => {
  const code = fs.readFileSync(file, "utf8");
  const inline = (code.match(/style\s*=\s*{[^}]*}/g) || []).length;
  const css = (code.match(/class(Name)?\s*=\s*["'`][^"'`]*["'`]/g) || [])
    .length;
  const all = inline + css;
  totalInline += inline;
  totalClass += css;
  totalAll += all;
  const pctInline = all ? ((inline / all) * 100).toFixed(1) : 0;
  const pctCss = all ? ((css / all) * 100).toFixed(1) : 0;
  console.log(
    `${file
      .split("/")
      .pop()}\t${inline}\t\t${css}\t\t${pctInline}%\t\t${pctCss}%`
  );
});
const pctInlineAll = totalAll ? ((totalInline / totalAll) * 100).toFixed(1) : 0;
const pctCssAll = totalAll ? ((totalClass / totalAll) * 100).toFixed(1) : 0;
console.log(
  `TOTAL\t\t${totalInline}\t\t${totalClass}\t\t${pctInlineAll}%\t\t${pctCssAll}%`
);
