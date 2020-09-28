module.exports = {
  type: "Screen",
  options: {
    title: "Пользователи",
    reference: "/me",
  },
  blocks: [
    {
      type: "Pages/DefaultPageWithList",
      options: { title: "Мой профиль" },
      slots: {
        headingAction: {
          type: "Actions/Button",
          options: { name: "Редактировать", icon: "edit", buttonType: "SECONDARY" },
          actions: {
            click: {
              type: "update-context",
              context: "",
            },
          },
        },
        mainContent: {
          type: "UserProfile",
          dataSource: {
            type: "context",
            options: {
              key: "global:currentUser",
            },
          },
        },
      },
    },
  ],
};
