import { useState, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
}

const FormInput = memo(({ label, icon, ...props }: FormInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = props.type === 'password';

    // Memoize handlers
    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        props.onFocus?.(e);
    }, [props.onFocus]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        props.onBlur?.(e);
    }, [props.onBlur]);

    const handleTogglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    // Memoize label classes and styles
    const labelStyles = useMemo(() => ({
        y: isFocused || props.value ? -32 : 0,
        x: isFocused || props.value ? -12 : 0,
        scale: isFocused || props.value ? 0.85 : 1,
        color: isFocused ? 'rgb(99, 102, 241)' : 'rgb(156, 163, 175)',
    }), [isFocused, props.value]);

    const labelClassName = useMemo(() => `
        absolute ${icon ? 'left-12' : 'left-4'} 
        transform pointer-events-none origin-[0%_50%] 
        text-gray-400 z-20 select-none whitespace-nowrap
        ${!isFocused && !props.value && 'translate-y-[7px]'}
        ${(isFocused || props.value) && 'bg-slate-900/95 px-2 py-0.5 rounded-full'}
    `, [icon, isFocused, props.value]);

    return (
        <div className="relative h-14">
            <div className="relative flex items-center h-full">
                {icon && (
                    <div className="absolute left-4 flex items-center justify-center w-5 h-5 text-gray-400 z-40 select-none pointer-events-none">
                        {icon}
                    </div>
                )}

                <motion.label
                    initial={false}
                    animate={labelStyles}
                    transition={{ type: "tween", duration: 0.1 }}
                    className={labelClassName}
                >
                    {label}
                </motion.label>

                <input
                    {...props}
                    type={isPasswordType ? (showPassword ? 'text' : 'password') : props.type}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`
                        w-full h-12 bg-white/5 border rounded-lg text-white
                        placeholder-transparent
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                        transition-colors duration-150
                        ${icon ? 'pl-12' : 'pl-4'}
                        ${isPasswordType ? 'pr-12' : 'pr-4'}
                        ${isFocused ? 'border-indigo-500 bg-white/10' : 'border-white/10'}
                        relative z-10
                    `}
                />

                {isPasswordType && (
                    <button
                        type="button"
                        onClick={handleTogglePassword}
                        className="absolute right-4 p-1.5 text-gray-400 hover:text-gray-300 
                                 transition-colors focus:outline-none focus:ring-2 
                                 focus:ring-indigo-500/50 rounded-md z-40"
                        tabIndex={-1}
                    >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
});

FormInput.displayName = 'FormInput';

export default FormInput;
