import gql from "gql-tag";

export const USER = gql`
query User($asHtml: Boolean, $id: Int, $name: String, $search: String, $sort: [UserSort]){
    User(id: $id, name: $name, search: $search, sort: $sort){
        id
        name
        about(asHtml: $asHtml)
        avatar{
            large
            medium
        }
        bannerImage
        isFollowing
        isFollower
        isBlocked
        bans
        options{
            titleLanguage
            displayAdultContent
            airingNotifications
            profileColor
        }
        mediaListOptions{
            scoreFormat
            rowOrder
        }
        unreadNotificationCount
        siteUrl
        donatorTier
        donatorBadge
        moderatorStatus
        updatedAt
    }
}
`;
