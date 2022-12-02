import {CSSProperties} from "react";
import {QCColors} from "@/components/Enums/Const";

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
    styles.backgroundColor = QCColors.Custom;
  }
  if (ltrQcPosition.indexOf(index + 1) > -1) {
    styles.backgroundColor = QCColors.LTR;
  }
  if (pooledQcPosition.indexOf(index + 1) > -1) {
    styles.backgroundColor = QCColors.Pooled;
  }
  if (solventQcPosition.indexOf(index + 1) > -1) {
    styles.backgroundColor = QCColors.Solvent;
  }
  if (blankQcPosition.indexOf(index + 1) > -1) {
    styles.backgroundColor = QCColors.Blank;
  }
  if (samplePosition?.indexOf(index + 1) > -1){
    styles.backgroundColor = 'gold';
  }

  if (selected) {
    styles.borderColor = 'red';
  }
  return styles;
}
