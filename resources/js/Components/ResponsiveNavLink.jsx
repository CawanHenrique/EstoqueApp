import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`w-full flex items-start ps-3 pe-4 py-2 ${
                active
                    ? ' text-white outline-none'
                    : 'border-transparent text-white outline-none '
            } text-base font-medium outline-none transition duration-150 ease-in-out ${className} no-underline`} // Adiciona a classe aqui
        >
            {children}
        </Link>
    );
}