from pathlib import Path
import re

src = Path("/mnt/data/ProfileEditor_WITH_VIDEO.tsx")
out = Path("/mnt/data/ProfileEditor_PLAN_ENFORCEMENT.tsx")

text = src.read_text(encoding="utf-8")

text = text.replace(
    'import { categories } from "@/data/categories";',
    'import { categories } from "@/data/categories";\nimport {\n  getPlanRules,\n  type PlanKey,\n} from "@/config/planRules";',
    1,
)

pattern = re.compile(
    r'''type PlanKey =\s*
  \| "free"\s*
  \| "pro"\s*
  \| "expert"\s*
  \| "category_featured"\s*
  \| "category_exclusive";\s*
\s*
const normalizePlanKey = \(value: unknown\): PlanKey => \{.*?\n\};\s*
''',
    re.S,
)
replacement = '''const normalizePlanKey = (value: unknown): PlanKey => {
  const normalized = text(value)
    .trim()
    .toLowerCase()
    .replace(/[\\s-]+/g, "_");

  if (
    normalized === "category_exclusive" ||
    normalized === "exclusive"
  ) {
    return "category_exclusive";
  }

  if (
    normalized === "category_featured" ||
    normalized === "featured"
  ) {
    return "category_featured";
  }

  // Preserve older Pro records by treating them as Expert.
  if (
    normalized === "expert" ||
    normalized === "pro"
  ) {
    return "expert";
  }

  return "free";
};

'''
text, count = pattern.subn(lambda m: replacement, text, count=1)
if count != 1:
    raise RuntimeError("Could not replace local PlanKey/normalization block.")

pattern2 = re.compile(
    r'''const planLabel = \(plan: PlanKey\): string => \{.*?\n\};\s*
''',
    re.S,
)
text, count = pattern2.subn("", text, count=1)
if count != 1:
    raise RuntimeError("Could not remove local planLabel helper.")

old = '''  const hasVideoAccess =
    planKey === "category_featured" ||
    planKey === "category_exclusive";
'''
new = '''  const planRules = getPlanRules(planKey);

  const hasVideoAccess =
    planRules.video;

  const practiceAreaLimit =
    planRules.practiceAreas;
'''
text = text.replace(old, new, 1)

pattern3 = re.compile(
    r'''  const togglePracticeArea = \(
    categorySlug: string
  \) => \{
    setForm\(\(current\) => \{
      const alreadySelected =
        current\.practiceAreas\.includes\(
          categorySlug
        \);

      return \{
        \.\.\.current,
        practiceAreas: alreadySelected
          \? current\.practiceAreas\.filter\(
              \(slug\) =>
                slug !== categorySlug
            \)
          : \[
              \.\.\.current\.practiceAreas,
              categorySlug,
            \],
      \};
    \}\);
  \};''',
    re.S,
)
replacement3 = '''  const togglePracticeArea = (
    categorySlug: string
  ) => {
    setMessage("");
    setMessageType("");

    setForm((current) => {
      const alreadySelected =
        current.practiceAreas.includes(
          categorySlug
        );

      if (alreadySelected) {
        return {
          ...current,
          practiceAreas:
            current.practiceAreas.filter(
              (slug) =>
                slug !== categorySlug
            ),
        };
      }

      if (
        current.practiceAreas.length >=
        practiceAreaLimit
      ) {
        setMessage(
          `${planRules.displayName} allows up to ${practiceAreaLimit} practice area${
            practiceAreaLimit === 1 ? "" : "s"
          }. Upgrade your plan to add more.`
        );
        setMessageType("error");
        return current;
      }

      return {
        ...current,
        practiceAreas: [
          ...current.practiceAreas,
          categorySlug,
        ],
      };
    });
  };'''
text, count = pattern3.subn(lambda m: replacement3, text, count=1)
if count != 1:
    raise RuntimeError("Could not replace togglePracticeArea.")

needle = '''    if (form.practiceAreas.length === 0) {
      setMessage(
        "Select at least one practice area."
      );
      setMessageType("error");
      return;
    }

'''
insert = needle + '''    if (
      form.practiceAreas.length >
      practiceAreaLimit
    ) {
      setMessage(
        `${planRules.displayName} allows up to ${practiceAreaLimit} practice area${
          practiceAreaLimit === 1 ? "" : "s"
        }. Remove extra selections before saving.`
      );
      setMessageType("error");
      return;
    }

'''
text = text.replace(needle, insert, 1)

text = text.replace(
    '''        specialties:
          form.practiceAreas,''',
    '''        specialties:
          form.practiceAreas.slice(
            0,
            practiceAreaLimit
          ),''',
    1,
)

text = text.replace(
    '''                Select every practice area
                offered by your firm.''',
    '''                Select up to {practiceAreaLimit} practice area{practiceAreaLimit === 1 ? "" : "s"} with your {planRules.displayName} plan.''',
    1,
)

old_button = '''                    onClick={() =>
                      togglePracticeArea(
                        category.slug
                      )
                    }
                    aria-pressed={isSelected}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${'''
new_button = '''                    onClick={() =>
                      togglePracticeArea(
                        category.slug
                      )
                    }
                    disabled={
                      !isSelected &&
                      form.practiceAreas.length >=
                        practiceAreaLimit
                    }
                    aria-pressed={isSelected}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${'''
text = text.replace(old_button, new_button, 1)

text = text.replace("{planLabel(planKey)}", "{planRules.displayName}")
text = text.replace(
    "Featured or Exclusive required",
    "Category Featured or Exclusive required",
)

needle2 = '''                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Embed a YouTube or Vimeo introduction video
                    on your public firm profile.
                  </p>'''
replacement2 = '''                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Embed a YouTube or Vimeo introduction video
                    on your public firm profile.
                  </p>

                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Current plan: {planRules.displayName} ·
                    {planRules.video
                      ? " Video enabled"
                      : " Video locked"}
                  </p>'''
text = text.replace(needle2, replacement2, 1)

marker = '''          {/* Practice areas */}
          <section className="rounded-xl border bg-gray-50 p-5">'''
summary = '''          {/* Current plan limits */}
          <section className="rounded-xl border border-[#0F2A43]/10 bg-[#0F2A43] p-5 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4A62A]">
                  Current Subscription
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  {planRules.displayName}
                </h3>

                <p className="mt-2 text-sm text-white/75">
                  Up to {planRules.practiceAreas} practice area{planRules.practiceAreas === 1 ? "" : "s"} ·
                  {" "}{planRules.attorneyLimit} attorney profile{planRules.attorneyLimit === 1 ? "" : "s"} ·
                  {" "}{planRules.video ? "Video enabled" : "Video locked"}
                </p>
              </div>

              <Badge className="w-fit bg-white text-[#0F2A43] hover:bg-white">
                Plan rules active
              </Badge>
            </div>
          </section>

          {/* Practice areas */}
          <section className="rounded-xl border bg-gray-50 p-5">'''
text = text.replace(marker, summary, 1)

text = text.replace("\r\n", "\n")

assert 'from "@/config/planRules"' in text
assert "const planRules = getPlanRules(planKey);" in text
assert "practiceAreaLimit" in text
assert "planRules.video" in text
assert 'type PlanKey =' not in text
assert "planLabel" not in text

out.write_text(text, encoding="utf-8")
print(f"Created {out}")
print(f"Lines: {len(text.splitlines())}")
print("Centralized plan rules: yes")
print("Practice-area limit enforcement: yes")
print("Video access enforcement: yes")
