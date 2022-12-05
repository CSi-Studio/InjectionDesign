import {CSSProperties} from "react";
import {SampleColors} from "@/components/Enums/Const";

export function buildStyles({index, wellPlate, disabled, booked, selected}: any,
                            customQcPosition: number[],
                            ltrQcPosition: number[],
                            pooledQcPosition: number[],
                            solventQcPosition: number[],
                            blankQcPosition: number[],
                            samplePosition: number[],
                            ) {
  const position = wellPlate.getPosition(index, 'row_column');
  const styles: CSSProperties = {};
  if (disabled) {
    if (position.row === 1) {
      styles.backgroundColor = 'grey';
    } else {
      styles.backgroundColor = 'lightgray';
    }
  }

  if (booked && !disabled) {
    styles.borderColor = 'red';
  }

  if (customQcPosition.indexOf(index + 1) > -1) {
    styles.backgroundColor = SampleColors.Custom;
  }
  if (ltrQcPosition.indexOf(index + 1) > -1) {
    styles.backgroundColor = SampleColors.LTR;
  }
  if (pooledQcPosition.indexOf(index + 1) > -1) {
    styles.backgroundColor = SampleColors.Pooled;
  }
  if (solventQcPosition.indexOf(index + 1) > -1) {
    styles.backgroundColor = SampleColors.Solvent;
  }
  if (blankQcPosition.indexOf(index + 1) > -1) {
    styles.backgroundColor = SampleColors.Blank;
  }
  if (samplePosition?.indexOf(index + 1) > -1){
    styles.backgroundColor = 'gold';
  }

  if (selected) {
    styles.borderColor = 'red';
  }
  return styles;
}
