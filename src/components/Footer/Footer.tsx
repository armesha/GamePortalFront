import DNALogo from '@/assets/dna.png';
import UPCELogo from '@/assets/upce.svg';
import styles from './Footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    Game<span>Hub</span> © 2024
                </div>
                <div className={styles.text}>
                    Projekt GameHub na BVWA2 od týmu DNA pro UPCE
                </div>
            </div>
            <div className={styles.boxContainer}>
                <div className={styles.box}>
                    <img src={DNALogo} alt="DNA"/>
                    <span>Tým DNA</span>
                </div>
                <div className={styles.box}>
                    <UPCELogo/>
                    <span>UPCE</span>
                </div>
            </div>
        </footer>
    );
}