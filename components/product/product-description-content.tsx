type Specification = {
  label: string;
  value: string;
};

type ProductDescriptionContentProps = {
  description: string;
};

const specificationLabels = [
  "Recommended Uses For Product",
  "Connectivity Technology",
  "Display resolution",
  "Special Feature",
  "Recommended Uses",
  "Set name",
  "Connectivity",
  "Technology",
  "Brand",
];

function isFeatureStart(line: string) {
  return /^(?:[•*\-]\s*)?(?:✅\s*)?(?:\[[^\]]+\]\s*:)/.test(line);
}

function splitDescription(description: string) {
  const lines = description
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const aboutIndex = lines.findIndex((line) => line.toLowerCase() === "about this item");
  const detailLines = aboutIndex >= 0 ? lines.slice(0, aboutIndex) : lines;
  const contentLines = aboutIndex >= 0 ? lines.slice(aboutIndex + 1) : [];
  const specifications: Specification[] = [];
  const introduction: string[] = [];

  for (const line of detailLines) {
    const label = specificationLabels.find((candidate) =>
      line.toLowerCase().startsWith(candidate.toLowerCase())
    );
    const value = label ? line.slice(label.length).replace(/^\s*:?\s*/, "") : "";

    if (label && value) {
      specifications.push({ label, value });
    } else if (line !== "About this item") {
      introduction.push(line);
    }
  }

  const featureSource = contentLines.length > 0 ? contentLines : introduction.filter(isFeatureStart);
  const remainingIntroduction = contentLines.length > 0
    ? introduction
    : introduction.filter((line) => !isFeatureStart(line));
  const features: string[] = [];
  let currentFeature: string[] = [];

  for (const line of featureSource) {
    if (isFeatureStart(line)) {
      if (currentFeature.length > 0) features.push(currentFeature.join(" "));
      currentFeature = [line.replace(/^(?:[•*\-]\s*)?(?:✅\s*)?/, "")];
    } else if (currentFeature.length > 0) {
      currentFeature.push(line);
    } else {
      remainingIntroduction.push(line);
    }
  }
  if (currentFeature.length > 0) features.push(currentFeature.join(" "));

  return { specifications, introduction: remainingIntroduction, features };
}

function FeatureText({ feature }: { feature: string }) {
  const match = feature.match(/^\[([^\]]+)\]\s*:?\s*(.*)$/);
  if (!match) return <span>{feature}</span>;

  return (
    <span>
      <strong className="font-medium text-slate-950">{match[1]}</strong>
      {match[2] ? `: ${match[2]}` : null}
    </span>
  );
}

export function ProductDescriptionContent({ description }: ProductDescriptionContentProps) {
  const { specifications, introduction, features } = splitDescription(description);

  return (
    <section className="mt-6 border-t border-slate-100 pt-6" aria-label="Product description">
      {specifications.length > 0 ? (
        <dl className="max-w-3xl divide-y divide-slate-100 border-y border-slate-100">
          {specifications.map((specification) => (
            <div key={`${specification.label}-${specification.value}`} className="grid grid-cols-[9rem_1fr] gap-2 py-1.5 text-xs sm:text-sm">
              <dt className="font-medium text-slate-800">{specification.label}</dt>
              <dd className="leading-relaxed text-slate-600">{specification.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {introduction.length > 0 ? (
        <div className={specifications.length > 0 ? "mt-5" : ""}>
          {introduction.map((paragraph, index) => (
            <p key={`${paragraph}-${index}`} className="mt-3 text-sm leading-relaxed text-slate-600">{paragraph}</p>
          ))}
        </div>
      ) : null}

      {features.length > 0 ? (
        <div className={specifications.length > 0 || introduction.length > 0 ? "mt-7" : ""}>
          <h2 className="text-lg font-medium tracking-tight text-slate-900 sm:text-xl">About this item</h2>
          <ul className="mt-3 space-y-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {features.map((feature, index) => (
              <li key={`${feature}-${index}`} className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-[#0a7ae6]" />
                <FeatureText feature={feature} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
