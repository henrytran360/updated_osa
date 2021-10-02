import fetch from "node-fetch";
import { GROUPME_ACCESS_TOKEN } from "../config";

export const createGroup = (course, term) => {
    return fetch(
        `https://api.groupme.com/v3/groups?token=${GROUPME_ACCESS_TOKEN}`,
        {
            method: "POST",
            body: JSON.stringify({
                name: `${course} - ${term} Term`,
                description: `A study group for ${course} ${term} - courtesy of hatch.`,
                share: true,
            }),
        }
    ).then((data) => {
        return data.json().then(async (r) => {
            let inviteLink = r.response.share_url;

            return inviteLink;
        });
    });
};
