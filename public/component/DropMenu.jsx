import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const DropMenu  = ({ title, items, basePath }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <li className="parent"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="txt_hv">{title}</span>
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        className="sub"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ul>
                            {items.map((item, i) => (
                                <li key={i}>
                                    <Link to={`/${basePath}/${item.slug}`}>{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </li>
    );
};

export default DropMenu;