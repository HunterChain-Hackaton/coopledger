'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import {
  RiLeafLine, RiSunLine, RiArrowLeftLine, RiMenuLine, RiCloseLine,
  RiAddLine, RiSubtractLine, RiShieldCheckLine, RiSmartphoneLine,
  RiSearchLine,
} from 'react-icons/ri';
import { HelpCircle, ArrowRight, Info } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'general',
    label: 'Général',
    questions: [
      {
        q: 'Qu\'est-ce que CoopLedger ?',
        a: 'CoopLedger est une plateforme numérique de gouvernance financière pour les coopératives agricoles togolaises. Elle permet d\'enregistrer chaque transaction et chaque vote sur la blockchain Polygon, garantissant une transparence totale et vérifiable par tous les membres et partenaires.',
      },
      {
        q: 'Qui peut utiliser CoopLedger ?',
        a: 'CoopLedger s\'adresse à quatre types d\'utilisateurs : les membres agriculteurs (via l\'application mobile), les présidents et trésoriers de coopératives (via le tableau de bord web), les auditeurs externes (accès lecture seule), et les agents du Ministère de l\'Agriculture du Togo (vue consolidée de toutes les coopératives).',
      },
      {
        q: 'CoopLedger est-il gratuit ?',
        a: 'CoopLedger est une initiative soutenue par le Ministère de l\'Agriculture du Togo dans le cadre du MIABE Hackathon 2026. Les frais blockchain sont extrêmement faibles (0,001 $ à 0,01 $ par transaction sur Polygon), rendant la plateforme économiquement accessible même pour les micro-cotisations en FCFA.',
      },
      {
        q: 'Dans quelles langues est disponible CoopLedger ?',
        a: 'La plateforme est actuellement disponible en français (Phase 1 et 2). La structure est prête pour l\'ajout de l\'Éwé et du Kabiyè dans une phase ultérieure, afin de servir les membres non francophones.',
      },
      {
        q: 'Qu\'est-ce que le MIABE Hackathon 2026 ?',
        a: 'Le MIABE Hackathon 2026 est une compétition d\'innovation technologique sur le thème « La Blockchain, levier du développement durable africain ». CoopLedger est le projet T-02 de l\'équipe Hunter Chain TG-35, couvrant les phases 1 (Présélection) et 2 (Demi-finale).',
      },
    ],
  },
  {
    id: 'compte',
    label: 'Compte & Connexion',
    questions: [
      {
        q: 'Comment créer mon compte sur CoopLedger ?',
        a: 'Vous ne créez pas vous-même votre compte. C\'est le président de votre coopérative qui vous inscrit dans le système. Dès votre inscription, vous recevez automatiquement un SMS d\'invitation avec les instructions de connexion. Si votre coopérative n\'est pas encore sur CoopLedger, le président peut soumettre une demande d\'inscription sur la page publique.',
      },
      {
        q: 'Comment me connecter ? Je n\'ai pas de mot de passe.',
        a: 'CoopLedger utilise un système d\'authentification sans mot de passe permanent. À chaque connexion, vous saisissez votre numéro de téléphone et vous recevez un code OTP à 6 chiffres par SMS, valable 5 minutes. Sur l\'application mobile, vous pouvez aussi activer la biométrie (empreinte digitale ou reconnaissance faciale) pour un accès rapide.',
      },
      {
        q: 'Je n\'ai pas reçu le SMS avec le code OTP, que faire ?',
        a: 'Attendez 60 secondes puis cliquez sur "Renvoyer le code". Vérifiez que le numéro saisi est correct (avec l\'indicatif +228 pour le Togo). Si le problème persiste après 3 tentatives, contactez votre président de coopérative qui pourra vérifier votre numéro enregistré dans le système.',
      },
      {
        q: 'J\'ai perdu mon téléphone. Mon compte est-il en danger ?',
        a: 'Contactez immédiatement votre président de coopérative pour qu\'il désactive temporairement votre accès. Vos données (transactions, votes passés) sont conservées et seront à nouveau accessibles dès la réactivation de votre compte avec votre nouveau numéro. Les données biométriques ne quittent jamais votre appareil — elles ne sont pas stockées sur nos serveurs.',
      },
      {
        q: 'Mon compte est bloqué, que faire ?',
        a: 'Le compte est bloqué après 3 tentatives OTP incorrectes, ou peut être désactivé par le président. Contactez directement votre président de coopérative pour réactiver votre accès. Le support technique (support@coopledger.tg) peut également vous aider.',
      },
    ],
  },
  {
    id: 'transactions',
    label: 'Transactions',
    questions: [
      {
        q: 'Qui peut enregistrer une transaction ?',
        a: 'Seuls le président et le trésorier de la coopérative peuvent créer des transactions manuelles sur le tableau de bord web. Les membres (via l\'application mobile) peuvent uniquement consulter l\'historique. Les cotisations Mobile Money sont créées automatiquement lors d\'un paiement validé par l\'opérateur.',
      },
      {
        q: 'Que signifie le statut "En attente" d\'une transaction ?',
        a: '"En attente" signifie que la transaction a été enregistrée dans notre base de données mais que la confirmation blockchain Polygon n\'est pas encore arrivée. Ce processus prend généralement quelques secondes à quelques minutes selon le réseau. Dès confirmation, le statut passe à "Confirmé blockchain" et un lien PolygonScan apparaît.',
      },
      {
        q: 'Comment vérifier qu\'une transaction est authentique ?',
        a: 'Chaque transaction confirmée affiche un "Hash blockchain" — une suite de caractères commençant par "0x". Cliquez sur le lien PolygonScan associé pour voir la preuve publique sur la blockchain. Le hash SHA-256 permet de vérifier que la description de la transaction n\'a pas été modifiée après enregistrement. Ces vérifications sont accessibles à tous, sans compte.',
      },
      {
        q: 'Puis-je modifier ou supprimer une transaction enregistrée ?',
        a: 'Non, et c\'est précisément le point fort de CoopLedger. Une fois la transaction ancrée sur la blockchain Polygon, son hash est permanent et immuable. Aucun trésorier, président ou administrateur ne peut modifier les données financières validées. Si une erreur est commise, il faut créer une nouvelle transaction corrective.',
      },
      {
        q: 'Quels types de transactions puis-je créer ?',
        a: 'CoopLedger gère 6 types : Cotisation (versement régulier des membres), Cotisation Mobile Money (créée automatiquement via T-Money/Flooz), Achat d\'intrants (semences, engrais, matériel), Prime / Distribution (versements aux membres), Dépense administrative (frais de fonctionnement), et Autre (toute opération hors catégorie).',
      },
      {
        q: 'Comment exporter l\'historique des transactions ?',
        a: 'Depuis l\'écran Transactions (tableau de bord web), cliquez sur "Exporter CSV" en haut de la liste. Vous pouvez d\'abord filtrer par type, période, direction (entrée/sortie) ou statut blockchain avant d\'exporter pour obtenir uniquement les données souhaitées.',
      },
    ],
  },
  {
    id: 'cotisations',
    label: 'Cotisations Mobile Money',
    questions: [
      {
        q: 'Comment payer ma cotisation par Mobile Money ?',
        a: 'Depuis l\'application mobile ou le site web, allez dans "Cotisations", trouvez la campagne ouverte et cliquez sur "Cotiser maintenant". Choisissez votre opérateur (T-Money rouge / Flooz bleu), entrez votre numéro de téléphone avec l\'indicatif +228, puis confirmez via la demande USSD qui arrive sur votre téléphone en entrant votre code PIN Mobile Money.',
      },
      {
        q: 'La demande USSD n\'est pas arrivée sur mon téléphone, que faire ?',
        a: 'Vérifiez que vous avez du crédit Mobile Money suffisant et une bonne couverture réseau. Attendez 30 secondes et recommencez depuis l\'application. Si le problème persiste, contactez votre trésorier. CoopLedger ne stocke jamais votre code PIN Mobile Money — le paiement est traité directement par FedaPay et votre opérateur.',
      },
      {
        q: 'Puis-je payer plusieurs fois la même campagne de cotisation ?',
        a: 'Non, un membre ne peut payer qu\'une seule fois par campagne de cotisation. Si votre cotisation est déjà confirmée, le bouton affiche "Cotisation payée" en vert. Cela évite les doublons et garantit l\'intégrité des données.',
      },
      {
        q: 'Qu\'est-ce qu\'une campagne de cotisation ?',
        a: 'Une campagne est une opération de collecte lancée par le président ou le trésorier, définie par un titre (ex : "Cotisation mensuelle Mai 2026"), un montant fixe par membre en FCFA, une liste de membres ciblés (tous / agriculteurs uniquement / sélection manuelle), et éventuellement une date limite. Chaque paiement validé génère automatiquement une transaction ancrée sur Polygon.',
      },
    ],
  },
  {
    id: 'votes',
    label: 'Votes',
    questions: [
      {
        q: 'Comment voter sur une résolution ?',
        a: 'Sur le site web : allez dans "Votes", cliquez sur le vote, lisez la description et cliquez sur "POUR" ou "CONTRE". Sur l\'application mobile : tapez sur la notification reçue ou l\'onglet "Votes", sélectionnez le vote, puis votez avec confirmation biométrique (empreinte digitale ou visage). Sur mobile, un vote hors connexion est possible — il sera synchronisé à la reconnexion.',
      },
      {
        q: 'Puis-je changer mon vote après avoir voté ?',
        a: 'Non. Une fois votre vote enregistré, il est définitif. Sur l\'application mobile, le vote est ancré sur la blockchain via votre wallet personnel. Cette règle garantit l\'intégrité du processus démocratique de la coopérative.',
      },
      {
        q: 'Qu\'est-ce que le quorum ?',
        a: 'Le quorum est le nombre minimum de membres devant voter pour que le résultat soit considéré valide. Il est défini par le président lors de la création du vote (ex : 60 % des membres). Si le quorum n\'est pas atteint à la deadline, la résolution n\'est pas adoptée même si la majorité des votants était POUR.',
      },
      {
        q: 'Comment sont publiés les résultats d\'un vote ?',
        a: 'À la clôture du vote (automatique à la deadline, ou manuelle par le président), les résultats — nombre de voix POUR, CONTRE, quorum atteint ou non, résolution passée ou non — sont enregistrés sur la blockchain Polygon. Ils sont ensuite accessibles à tous les membres (web et mobile) avec la preuve on-chain vérifiable sur PolygonScan.',
      },
      {
        q: 'Puis-je voter si je n\'ai pas de connexion internet ?',
        a: 'Oui, sur l\'application mobile uniquement. L\'app détecte l\'absence de connexion et passe en mode hors-ligne. Votre vote est stocké localement sur votre appareil et envoyé automatiquement dès le retour de la connexion, à condition que la deadline du vote ne soit pas encore expirée. Si la deadline expire avant la synchronisation, le vote est annulé et vous êtes notifié.',
      },
    ],
  },
  {
    id: 'securite',
    label: 'Sécurité & Blockchain',
    questions: [
      {
        q: 'Qu\'est-ce qu\'un hash SHA-256 et pourquoi est-ce important ?',
        a: 'Un hash SHA-256 est une empreinte numérique unique générée à partir du contenu d\'une transaction ou d\'un document. Si le moindre caractère est modifié, le hash change complètement. CoopLedger enregistre ces hash sur Polygon : si quelqu\'un modifie une transaction dans la base de données, la différence avec le hash blockchain sera immédiatement détectable.',
      },
      {
        q: 'Où sont stockées mes données biométriques ?',
        a: 'Vos données biométriques (empreinte digitale, Face ID) ne quittent jamais votre appareil. Elles sont gérées exclusivement par l\'API native de votre téléphone (Expo LocalAuthentication) et ne sont jamais transmises à nos serveurs. CoopLedger ne peut pas accéder à vos données biométriques.',
      },
      {
        q: 'Qu\'est-ce qu\'un wallet blockchain custodial ?',
        a: 'À l\'inscription, le backend CoopLedger génère automatiquement un wallet Polygon (portefeuille numérique) pour chaque membre. La clé privée est chiffrée avec AES-256 et stockée de façon sécurisée sur nos serveurs. Vous n\'avez jamais à gérer cette clé vous-même — les transactions blockchain sont signées côté serveur en votre nom. Cette approche privilégie l\'accessibilité pour les utilisateurs peu familiers avec le Web3.',
      },
      {
        q: 'Que signifie "Polygon PoS" et pourquoi ce choix ?',
        a: 'Polygon PoS (Proof of Stake) est un réseau blockchain compatible Ethereum avec des frais très faibles (0,001 $ à 0,01 $) et une validation rapide (2 à 5 secondes). Le Proof of Stake consomme 99,9 % moins d\'énergie que Bitcoin (Proof of Work), ce qui en fait un choix aligné avec les ODD. Toutes les transactions sont publiquement vérifiables sur PolygonScan.',
      },
      {
        q: 'Comment vérifier une transaction sur PolygonScan ?',
        a: 'Dans CoopLedger, cliquez sur n\'importe quelle transaction confirmée pour voir ses détails. Vous y trouverez le "Hash blockchain" (commençant par 0x). Cliquez sur le lien PolygonScan pour voir la preuve publique sur la blockchain. Cette vérification est accessible à tous, sans compte, même aux auditeurs externes.',
      },
      {
        q: 'Les transactions peuvent-elles être supprimées ou modifiées ?',
        a: 'Non, jamais. Une fois le hash d\'une transaction enregistré sur Polygon, il est permanent. C\'est le principe fondateur de CoopLedger : aucun trésorier, aucun président, aucun administrateur ne peut modifier une donnée financière validée. La transparence est mathématiquement garantie.',
      },
    ],
  },
  {
    id: 'mobile',
    label: 'Application mobile',
    questions: [
      {
        q: 'Sur quels appareils fonctionne l\'application CoopLedger ?',
        a: 'L\'application fonctionne sur Android 8 et supérieur, et iOS 13 et supérieur, couvrant plus de 95 % des appareils récents disponibles au Togo. Elle est construite avec React Native + Expo pour un build simultané Android et iOS. Le fichier d\'installation Android (APK) est téléchargeable directement depuis le site.',
      },
      {
        q: 'L\'application fonctionne-t-elle sans internet ?',
        a: 'En partie. En mode hors-ligne, vous pouvez consulter le solde, l\'historique des transactions et les rapports déjà chargés, lire les votes ouverts et voter (vote stocké localement). Les paiements Mobile Money nécessitent une connexion internet. Après 4 heures sans synchronisation, une notification locale vous rappelle les actions en attente.',
      },
      {
        q: 'Comment activer les notifications push ?',
        a: 'Dans l\'application, allez dans "Paramètres" et activez le bouton "Notifications push". Acceptez la demande d\'autorisation de votre téléphone. Vous recevrez des alertes pour chaque nouveau vote ouvert, nouvelle campagne de cotisation, et confirmation de paiement.',
      },
      {
        q: 'L\'application est-elle lourde ? Mon téléphone a peu de stockage.',
        a: 'L\'application a été conçue pour les appareils d\'entrée de gamme courants au Togo. Elle ne dépasse pas 30 Mo installée et minimise la consommation de données mobiles en ne transmettant que les hash cryptographiques sur la blockchain (pas les données brutes).',
      },
    ],
  },
  {
    id: 'cooperative',
    label: 'Gestion de coopérative',
    questions: [
      {
        q: 'Comment inscrire ma coopérative sur CoopLedger ?',
        a: 'Soumettez une demande d\'inscription depuis la page publique (coopledger.duckdns.org → "Demande d\'inscription"). Remplissez le formulaire avec le nom officiel, la région, l\'adresse, le NIF fiscal, et les informations du président. Le Ministère de l\'Agriculture examine le dossier et vous contacte. En cas d\'approbation, un compte est créé automatiquement pour le président avec les accès envoyés par email.',
      },
      {
        q: 'Un membre peut-il appartenir à plusieurs coopératives ?',
        a: 'Non. Un numéro de téléphone ne peut être enregistré qu\'une seule fois dans tout le système CoopLedger. Si un membre appartient déjà à une autre coopérative, son inscription dans une nouvelle coopérative sera refusée.',
      },
      {
        q: 'Comment générer le rapport mensuel ?',
        a: 'CoopLedger génère automatiquement un rapport PDF le 1er de chaque mois pour chaque coopérative. Le rapport inclut le solde d\'ouverture et de clôture, le total des entrées/sorties, le détail de chaque transaction, les résultats des votes du mois, et le hash blockchain pour certification. Le président peut aussi générer manuellement un rapport partiel à tout moment depuis la page Rapports.',
      },
      {
        q: 'Puis-je désactiver un membre qui quitte la coopérative ?',
        a: 'Oui. Le président peut désactiver un membre depuis la liste des membres (bouton "Désactiver"). La désactivation empêche l\'accès futur au système mais conserve intégralement l\'historique des transactions et votes passés du membre. L\'historique blockchain étant immuable, ces données resteront toujours accessibles.',
      },
      {
        q: 'Que voit le Ministère de l\'Agriculture ?',
        a: 'Les agents du Ministère ont accès à une interface dédiée affichant toutes les coopératives actives avec leurs indicateurs en temps réel (solde, nombre de membres, transactions, votes). Ils peuvent approuver ou rejeter les demandes d\'inscription et créer directement des coopératives. Ils n\'ont pas accès aux données internes détaillées des coopératives.',
      },
    ],
  },
];

function AccordionItem({ q, a, accent, isOpen, onToggle }: { q: string; a: string; accent: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 16, padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 500, color: isOpen ? accent : 'var(--text-primary)', lineHeight: 1.5, flex: 1, transition: 'color 0.2s' }}>
          {q}
        </span>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: isOpen ? `${accent}18` : 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s', marginTop: 1 }}>
          {isOpen
            ? <RiSubtractLine size={16} style={{ color: accent }} />
            : <RiAddLine size={16} style={{ color: 'var(--text-muted)' }} />
          }
        </div>
      </button>
      {isOpen && (
        <div style={{ paddingBottom: 20, paddingRight: 44, animation: 'fadeIn 0.2s ease' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const { theme, toggle } = useTheme();
  const isDry = theme === 'dry';
  const accent = isDry ? '#f07a2a' : '#059669';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');

  const toggleItem = (key: string) => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredCategories = search.trim().length < 2
    ? FAQ_CATEGORIES
    : FAQ_CATEGORIES.map(cat => ({
        ...cat,
        questions: cat.questions.filter(faq =>
          faq.q.toLowerCase().includes(search.toLowerCase()) ||
          faq.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(cat => cat.questions.length > 0);

  const activeQuestions = search.trim().length >= 2
    ? filteredCategories.flatMap(c => c.questions.map(q => ({ ...q, catId: c.id })))
    : (FAQ_CATEGORIES.find(c => c.id === activeCategory)?.questions ?? []).map(q => ({ ...q, catId: activeCategory }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style>{`
        .faq-nav-desktop { display: flex; align-items: center; gap: 8px; }
        .faq-hamburger { display: none; }
        .faq-layout { display: grid; grid-template-columns: 220px 1fr; gap: 32px; align-items: flex-start; }
        .faq-sidebar { position: sticky; top: 80px; }
        .faq-hero-title { font-size: 42px; }

        @media (max-width: 820px) {
          .faq-layout { grid-template-columns: 1fr; }
          .faq-sidebar { position: static; }
        }

        @media (max-width: 640px) {
          .faq-nav-desktop { display: none; }
          .faq-hamburger { display: flex; }
          .faq-hero-title { font-size: 26px; line-height: 1.2; }
          .faq-hero-section { padding: 40px 0 32px !important; }
          .faq-content-pad { padding: 0 16px !important; }
          .faq-cat-scroll { display: flex; overflow-x: auto; gap: 8px; padding-bottom: 4px; flex-wrap: nowrap !important; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
          .faq-cat-scroll::-webkit-scrollbar { display: none; }
          .faq-cat-btn { white-space: nowrap; flex-shrink: 0; }
        }

        .faq-mobile-drawer {
          display: none;
          position: fixed; inset: 0; z-index: 50;
          background: var(--bg-secondary); flex-direction: column;
        }
        .faq-mobile-drawer.open { display: flex; }
      `}</style>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="faq-mobile-drawer open">
          <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDry ? <RiSunLine size={16} color="white" /> : <RiLeafLine size={16} color="white" />}
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>CoopLedger</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 8 }}>
              <RiCloseLine size={22} />
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px', gap: 8 }}>
            {[['/', 'Accueil'], ['/cooperatives', 'Coopératives'], ['/about', 'À propos']].map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '14px 16px', borderRadius: 10, color: 'var(--text-primary)', textDecoration: 'none', fontSize: 15, fontWeight: 500, border: '1px solid var(--border-subtle)' }}>
                {label}
              </Link>
            ))}
            <div style={{ flex: 1 }} />
            <button onClick={toggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'none', border: '1px solid var(--border)', borderRadius: 10, padding: '12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13 }}>
              {isDry ? <RiSunLine size={15} /> : <RiLeafLine size={15} />}
              <span>{isDry ? 'Saison sèche' : 'Saison des pluies'}</span>
            </button>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
              Connexion
            </Link>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'var(--text-muted)', fontSize: 13 }}>
              <RiArrowLeftLine size={14} /> Accueil
            </Link>
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDry ? <RiSunLine size={14} color="white" /> : <RiLeafLine size={14} color="white" />}
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>CoopLedger</span>
            </div>
          </div>
          <div className="faq-nav-desktop">
            <Link href="/cooperatives" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 13, padding: '6px 10px' }}>Coopératives</Link>
            <Link href="/about" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 13, padding: '6px 10px' }}>À propos</Link>
            <button onClick={toggle} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              {isDry ? <RiSunLine size={13} /> : <RiLeafLine size={13} />}
              <span>{isDry ? 'Sec' : 'Pluies'}</span>
            </button>
            <Link href="/login" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Connexion</Link>
          </div>
          <button className="faq-hamburger" onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '7px', cursor: 'pointer', color: 'var(--text-primary)', alignItems: 'center', justifyContent: 'center' }}>
            <RiMenuLine size={20} />
          </button>
        </div>
      </header>

      <main className="faq-content-pad" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Hero */}
        <div className="faq-hero-section" style={{ padding: '64px 0 40px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, background: 'var(--accent-subtle)', border: '1px solid var(--border)', marginBottom: 22 }}>
            <HelpCircle size={13} style={{ color: accent }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Foire aux questions</span>
          </div>
          <h1 className="faq-hero-title" style={{ fontFamily: 'DM Serif Display, serif', lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: 16 }}>
            Toutes vos questions,<br />
            <span style={{ color: accent }}>des réponses claires</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Retrouvez ici les réponses aux questions les plus fréquentes sur CoopLedger — de la connexion à la vérification blockchain, en passant par les cotisations Mobile Money.
          </p>

          {/* Search */}
          <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <RiSearchLine size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <input
              className="input"
              style={{ paddingLeft: 40, fontSize: 14 }}
              placeholder="Rechercher une question… (ex : biométrie, OTP, Polygon)"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '48px 0 64px' }}>
          {search.trim().length >= 2 ? (
            /* Search results */
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
                {activeQuestions.length} résultat{activeQuestions.length !== 1 ? 's' : ''} pour <strong style={{ color: 'var(--text-primary)' }}>"{search}"</strong>
              </p>
              {activeQuestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <HelpCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
                  <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Aucun résultat trouvé. Essayez un autre terme.</p>
                </div>
              ) : (
                <div className="card" style={{ padding: '0 24px' }}>
                  {activeQuestions.map((faq, i) => (
                    <AccordionItem
                      key={`search-${i}`}
                      q={faq.q}
                      a={faq.a}
                      accent={accent}
                      isOpen={!!openItems[`search-${i}`]}
                      onToggle={() => toggleItem(`search-${i}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="faq-layout">
              {/* Sidebar desktop */}
              <aside className="faq-sidebar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {FAQ_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: activeCategory === cat.id ? `${accent}12` : 'none',
                        color: activeCategory === cat.id ? accent : 'var(--text-secondary)',
                        fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: activeCategory === cat.id ? 600 : 400,
                        textAlign: 'left', transition: 'all 0.15s',
                        borderLeft: `2px solid ${activeCategory === cat.id ? accent : 'transparent'}`,
                      }}
                    >
                      <span>{cat.label}</span>
                      <span style={{ fontSize: 11, background: activeCategory === cat.id ? `${accent}18` : 'var(--bg-card-hover)', color: activeCategory === cat.id ? accent : 'var(--text-muted)', borderRadius: 10, padding: '1px 7px', fontWeight: 600 }}>
                        {cat.questions.length}
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              {/* Mobile category scroll */}
              <div style={{ display: 'none' }} className="faq-cat-mobile-only">
                {/* rendered via CSS on mobile by layout grid trick */}
              </div>

              {/* Content */}
              <div>
                {/* Mobile: category horizontal scroll */}
                <div className="faq-cat-scroll" style={{ display: 'none', marginBottom: 24 }}>
                  {FAQ_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      className="faq-cat-btn"
                      onClick={() => setActiveCategory(cat.id)}
                      style={{
                        padding: '8px 14px', borderRadius: 20, border: `1px solid ${activeCategory === cat.id ? accent : 'var(--border)'}`,
                        background: activeCategory === cat.id ? `${accent}12` : 'var(--bg-card)',
                        color: activeCategory === cat.id ? accent : 'var(--text-secondary)',
                        fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: activeCategory === cat.id ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {cat.label} <span style={{ marginLeft: 4, opacity: 0.7 }}>({cat.questions.length})</span>
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {FAQ_CATEGORIES.find(c => c.id === activeCategory)?.label}
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {FAQ_CATEGORIES.find(c => c.id === activeCategory)?.questions.length} question{(FAQ_CATEGORIES.find(c => c.id === activeCategory)?.questions.length ?? 0) > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="card" style={{ padding: '0 24px' }}>
                  {(FAQ_CATEGORIES.find(c => c.id === activeCategory)?.questions ?? []).map((faq, i) => (
                    <AccordionItem
                      key={`${activeCategory}-${i}`}
                      q={faq.q}
                      a={faq.a}
                      accent={accent}
                      isOpen={!!openItems[`${activeCategory}-${i}`]}
                      onToggle={() => toggleItem(`${activeCategory}-${i}`)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile category scroller (always show below hero on mobile) */}
        <style>{`
          @media (max-width: 820px) {
            .faq-cat-scroll { display: flex !important; }
          }
          @media (max-width: 820px) {
            .faq-layout { display: flex; flex-direction: column; }
            .faq-sidebar { display: none; }
          }
        `}</style>

        {/* Contact CTA */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 48, paddingBottom: 64, textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <HelpCircle size={26} style={{ color: accent }} />
          </div>
          <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>
            Vous n'avez pas trouvé votre réponse ?
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Notre équipe support est disponible du lundi au vendredi de 8h à 17h pour vous aider.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:support@coopledger.tg" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              support@coopledger.tg <ArrowRight size={14} />
            </a>
            <Link href="/cooperatives/apply" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Inscrire ma coopérative
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isDry ? <RiSunLine size={13} color="white" /> : <RiLeafLine size={13} color="white" />}
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>CoopLedger</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Projet T-02 · Hunter Chain TG-35 · MIABE Hackathon 2026 · Togo</p>
      </footer>
    </div>
  );
}
