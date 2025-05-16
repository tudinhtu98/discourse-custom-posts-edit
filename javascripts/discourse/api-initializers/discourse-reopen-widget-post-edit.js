import { apiInitializer } from "discourse/lib/api";
import { historyHeat } from "discourse/components/post/meta-data/edits-indicator";
import { longDate } from "discourse/lib/formatter";
import { i18n } from "discourse-i18n";

export default apiInitializer("1.8.0", (api) => {
  api.reopenWidget("post-edits-indicator", {
      html(attrs) {
        const isPostOfStaff = attrs.staff;
        if (isPostOfStaff && (!this.currentUser || (this.currentUser && !this.currentUser.staff))) {
          return;
        }

        let icon = "pencil";
        const updatedAt = new Date(attrs.updated_at);
        let className = historyHeat(this.siteSettings, updatedAt);
        const date = longDate(updatedAt);
        let title;

        if (attrs.wiki) {
          icon = "far-pen-to-square";
          className = `${className || ""} wiki`.trim();

          if (attrs.version > 1) {
            title = i18n("post.wiki_last_edited_on", { dateTime: date });
          } else {
            title = i18n("post.wiki.about");
          }
        } else {
          title = i18n("post.last_edited_on", { dateTime: date });
        }

        return this.attach("flat-button", {
          icon,
          translatedTitle: title,
          className,
          action: "onPostEditsIndicatorClick",
          translatedAriaLabel: i18n("post.edit_history"),
          translatedLabel: attrs.version > 1 ? attrs.version - 1 : "",
        });
      }
    });
});
