import style from './404.module.scss'

export function NotFound() {
  return (
    <main className={style.root}>
      <div className={style.container}>
        <div>
          <h1>404</h1>
          <h2>Error: 404 page not found</h2>
        </div>
      </div>
    </main>
  )
}
