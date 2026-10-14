import { Circle } from "@/components/Pen";
import type { WorkItem } from "@/data/portfolio";

type ScorecardData = NonNullable<WorkItem["scorecard"]>;

/** The real 2x2 score of a classifier checked against hand labels. The false alarms are
    circled in red: zero is the number that matters. The space after each number keeps
    "9 caught" readable as text and for screen readers; the number itself is a block in CSS. */
export default function Scorecard({ s }: { s: ScorecardData }) {
  return (
    <table className="scorecard">
      <caption>{s.caption}</caption>
      <tbody>
        <tr>
          <td>
            <b>{s.caught}</b> caught
          </td>
          <td>
            <b>{s.missed}</b> missed
          </td>
        </tr>
        <tr>
          <td>
            <b>
              <Circle>{s.falseAlarms}</Circle>
            </b> false alarms
          </td>
          <td>
            <b>{s.leftAlone}</b> left alone
          </td>
        </tr>
      </tbody>
    </table>
  );
}
