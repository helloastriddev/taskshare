export function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 font-sans text-gray-700 dark:text-gray-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Politique de confidentialité</h1>
      <p className="text-sm text-gray-400 mb-8">Dernière mise à jour : 19 juin 2026</p>

      <section className="space-y-6 text-sm leading-relaxed">

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">1. Présentation</h2>
          <p>
            TaskShare est une application web gratuite de gestion de listes de tâches collaboratives.
            Nous nous engageons à protéger la vie privée de nos utilisateurs.
            Cette page explique quelles données sont collectées et comment elles sont utilisées.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">2. Données collectées par TaskShare</h2>
          <p>
            TaskShare ne collecte <strong>aucune donnée personnelle</strong>. L'application fonctionne entièrement
            dans votre navigateur : vos listes de tâches sont stockées localement sur votre appareil
            via <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">localStorage</code>.
            Aucune information n'est transmise à nos serveurs.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
            <li>Pas de création de compte</li>
            <li>Pas de collecte d'adresse email</li>
            <li>Pas de suivi de votre activité</li>
            <li>Pas de cookies propres à TaskShare</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">3. Google AdSense</h2>
          <p>
            TaskShare utilise Google AdSense pour afficher des publicités. Google peut utiliser des cookies
            et collecter des données afin de personnaliser les annonces affichées, conformément à sa propre
            politique de confidentialité.
          </p>
          <p className="mt-2">
            Google AdSense peut notamment :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
            <li>Placer des cookies publicitaires sur votre navigateur</li>
            <li>Utiliser votre adresse IP à des fins de géolocalisation approximative</li>
            <li>Collecter des données sur vos centres d'intérêt pour afficher des annonces personnalisées</li>
          </ul>
          <p className="mt-2">
            Vous pouvez consulter la politique de confidentialité de Google ici :{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline"
            >
              policies.google.com/privacy
            </a>
          </p>
          <p className="mt-2">
            Vous pouvez également désactiver la personnalisation des annonces sur :{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline"
            >
              google.com/settings/ads
            </a>
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">4. Liens de partage</h2>
          <p>
            Lorsque vous partagez une liste via un lien, les données de cette liste (nom et tâches) sont
            encodées directement dans l'URL. Ces données ne transitent pas par nos serveurs, à l'exception
            du service de raccourcissement de liens tiers (is.gd) qui reçoit l'URL à raccourcir.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">5. Cookies</h2>
          <p>
            TaskShare n'utilise pas de cookies propres. Seul Google AdSense peut déposer des cookies
            tiers à des fins publicitaires (voir section 3). Le bandeau de consentement affiché lors
            de votre première visite vous permet de gérer vos préférences.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">6. Mineurs</h2>
          <p>
            TaskShare n'est pas destiné aux enfants de moins de 13 ans. Nous ne collectons
            sciemment aucune donnée personnelle concernant des mineurs.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">7. Modifications</h2>
          <p>
            Nous nous réservons le droit de mettre à jour cette politique de confidentialité.
            Toute modification sera indiquée par la date de mise à jour en haut de cette page.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">8. Contact</h2>
          <p>
            Pour toute question relative à cette politique, vous pouvez nous contacter à :{' '}
            <a href="mailto:rangbaastrid@gmail.com" className="text-indigo-500 hover:underline">
              rangbaastrid@gmail.com
            </a>
          </p>
        </div>

      </section>

      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
        <a href="/" className="text-sm text-indigo-500 hover:underline">← Retour à TaskShare</a>
      </div>
    </div>
  )
}
