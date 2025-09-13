import "./Footer.scss"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <p>Copyright &copy; {currentYear} Dillon Bellefeuille. All rights reserved.</p>
            <a href="mailto:bellefeuilledillon@gmail.com">bellefeuilledillon@gmail.com</a>
        </footer>
    )
}