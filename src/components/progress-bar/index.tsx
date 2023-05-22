type Progress = {
  /**Value of the progress, 60 = 60%*/
  value: number;
  /**Background color of the progress bar*/
  color: string;
}

type ProgressBarProps = {
  progresses: Progress[];
};

export const ProgressBar = ({ progresses }: ProgressBarProps) => {

  return (
    <div className="w-full h-3 rounded-3xl overflow-hidden bg-[#F6F1F2] flex items-center">
      { progresses.map((progress, index) => (
        <div
          key={ index }
          style={ { width: `${ (progress.value / 100) * 100 }%`, backgroundColor: `${ progress.color }` } }
          className={ 'h-full' }
        />
      )) }
    </div>
  );
};
