import { apiInitializer } from "discourse/lib/api";
import { historyHeat } from "discourse/widgets/post-edits-indicator";
import { longDate } from "discourse/lib/formatter";

export default apiInitializer("1.8.0", (api) => {
  api.reopenWidget("post-edits-indicator", {
      html(attrs) {
        const isPostOfStaff = attrs.user.admin || attrs.user.moderator;
        if (isPostOfStaff && (!this.currentUser || (this.currentUser && !this.currentUser.staff))) {
          return;
        }

        let icon = "pencil-alt";
        const updatedAt = new Date(attrs.updated_at);
        let className = historyHeat(this.siteSettings, updatedAt);
        const date = longDate(updatedAt);
        let title;
    
        if (attrs.wiki) {
          icon = "far-edit";
          className = `${className || ""} wiki`.trim();
    
          if (attrs.version > 1) {
            title = I18n.t("post.wiki_last_edited_on", { dateTime: date });
          } else {
            title = I18n.t("post.wiki.about");
          }
        } else {
          title = I18n.t("post.last_edited_on", { dateTime: date });
        }
    
        return this.attach("flat-button", {
          icon,
          translatedTitle: title,
          className,
          action: "onPostEditsIndicatorClick",
          translatedAriaLabel: I18n.t("post.edit_history"),
          translatedLabel: attrs.version > 1 ? attrs.version - 1 : "",
        });
      }
    });
});
