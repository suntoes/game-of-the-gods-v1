import Head from 'next/head'

const Layout = ({ children, title }) => {
  const t = `${title} - Coffee Dojo`
  return (
    <article>
      {title && (
        <Head>
          <title>{t}</title>
          <meta name="twitter:title" content={t} />
          <meta property="og:title" content={t} />
        </Head>
      )}

      {children}
    </article>
  )
}

export default Layout
