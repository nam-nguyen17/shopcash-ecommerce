import React from 'react'
import styles from './styles.module.scss'
import Links from './Links'
import Social from './Social'
import Newsletter from './Newsletter'
import Payment from './Payment'
import Copyright from './Copyright'

export default function Footer({ country }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <Links />
        <Social />
        <Newsletter />
        <Payment />
        <Copyright country={country} />
      </div>
    </footer>
  )
}
