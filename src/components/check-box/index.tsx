type CheckBoxProps = {
  label: string
  selected: boolean
  onChange: () => void
}

export const CheckBox = ({ label, selected, onChange }: CheckBoxProps) => {
  return (
    <label
      className="flex items-center cursor-pointer"
      onClick={onChange}
    >
      <span className="inline-flex w-6 h-6 rounded border-2 border-black-30 mr-3 items-center justify-center">
        {selected && (
          <svg
            viewBox="0 0 10 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
      </span>
      <span className="text-black-100 text-lg">{label}</span>
    </label>
  )
}
