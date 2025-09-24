const IconPaths = {
    dashboard:(
        <path fillRule="evenodd" d="M9 3a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 12a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2zm10 -4a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 -8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2z" clipRule="evenodd" />
    ),

    addUser:(
        <path fillRule="evenodd" d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0 M16 19h6 M19 16v6 M6 21v-2a4 4 0 0 1 4 -4h4" clipRule="evenodd"/>
    ),

    user:(
        <path fillRule="evenodd" d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" clipRule="evenodd" />
    ),

    searchDocument:(
        <path fillRule="evenodd" d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697 M18 12v-5a2 2 0 0 0 -2 -2h-2 M8 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z M8 11h4 M8 15h3 M16.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0 M18.5 19.5l2.5 2.5" clipRule="evenodd" />
    ),

    addDocument: (
        <path fillRule="evenodd" d="M14 3v4a1 1 0 0 0 1 1h4 M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z M12 11l0 6 M9 14l6 0" clipRule="evenodd" />
    ),

    report:(
        <path fillRule="evenodd" d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697 M18 14v4h4 M18 11v-4a2 2 0 0 0 -2 -2h-2 M8 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M8 11h4 M8 15h3" clipRule="evenodd"/>
    ),

    profile:(
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"/>
    ),

    logout:(
        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2 M9 12h12l-3 -3 M18 15l3 -3"/>
    )
}

const Icon = ({
    name,
    size = 24,
    className = "",
    color = "currentColor",
    fill = false,
    ...props
}) => {
    const iconElement = IconPaths[name]
    if (!iconElement) {
        console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(IconPaths));
        return null;
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            // 🔄 invertimos la lógica:
            fill={fill ? "none" : color}
            stroke={fill ? color : "none"}
            strokeWidth={fill ? "2" : "0"}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {iconElement}
        </svg>
    )
}

export default Icon