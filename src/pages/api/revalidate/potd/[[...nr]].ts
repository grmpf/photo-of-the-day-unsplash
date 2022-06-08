/** Revalidate POTD pages
 *
 * Requirements:
 * - Method: POST
 * - Authorization: via REPO_SECRET_KEY (GitHub)
 *
 * @testing curl --request POST --url 'http://localhost:3000/api/revalidate/potd' --header 'Authorization: Bearer REPO_SECRET_KEY' && echo ''
 */


import type { NextApiRequest, NextApiResponse } from 'next'
import potdLinks from "../../../../data/potdLinks";

/**
 * Checks GitHub API Secret
 * If the value of GH_REPO_SECRET_KEY contains a $ it has to be escaped beforehand (\$; but only the env-var)
 */
function isAuthorized(req: NextApiRequest, res: NextApiResponse) {
    const {authorization} = req.headers;
    return authorization === `Bearer ${process.env.GH_REPO_SECRET_KEY}`;
}

/**
 * This is used for a simple cronjob
 * @returns - {status: 200} in case of success or {status: ???, error: ''}
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { nr, test } = req.query

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({
            status: 405,
            error: 'Method Not Allowed',
        });
    }

    if(!isAuthorized(req, res)) {
        return res.status(401).json({
            status: 401,
            error: 'Unauthorized',
        });
    }

    // TODO: promise.all? unstable_revalidate doesn't return anything though
    try {
		if (nr || nr === '' || nr === '0') { // for "/" add "&nr="
			console.log(`[Next.js] Revalidating /${nr}`);
			await res.unstable_revalidate(`/${nr}`);
		} else {
			for (let i = 0; i < potdLinks.length; i++) {
				if(!potdLinks[i].noPreGen) {
					console.log(`[Next.js] Revalidating ${potdLinks[i].path}`);
					await res.unstable_revalidate(potdLinks[i].path);
				}
			}
		}

        return res.status(200).json({
            status: 200,
        })
    } catch (err) {
        // If there was an error, Next.js will continue to show the last successfully generated page
        //return res.status(500).send('Error revalidating')
        return res.status(500).json({
            status: 500,
            error: err?.message ?? 'Error revalidating',
        })
    }

}
