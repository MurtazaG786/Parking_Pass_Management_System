const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200/60 px-6 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} ParkEase. All rights reserved.</p>
                <p>Parking Pass Management System v1.0</p>
            </div>
        </footer>
    );
};

export default Footer;
