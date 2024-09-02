export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-azulescuro shadow-sm focus:ring-azulciano ' +
                className
            }
        />
    );
}
