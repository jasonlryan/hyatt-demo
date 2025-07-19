# 🎨 Proactive Styling Prompt for New Development

## 🎯 **Purpose**

This prompt ensures that **all new components and features** are built using the unified styling system from the start, preventing the need for retrospective migration.

## 📋 **Complete Proactive Styling Prompt**

### **For New Component Development**

```
You are developing a new React component for the Hive application.

CRITICAL STYLING REQUIREMENTS:
- NEVER use hardcoded Tailwind colors (bg-blue-*, text-green-*, bg-gray-*, etc.)
- ALWAYS use the unified design token system
- Follow established patterns from existing components
- Ensure accessibility and brand consistency

DESIGN TOKEN SYSTEM:
- Primary actions: bg-primary hover:bg-primary-hover text-white
- Success states: bg-success hover:bg-success-hover text-white
- Text hierarchy: text-text-primary (headings), text-text-secondary (body), text-text-muted (helper)
- Backgrounds: bg-secondary (containers), bg-bg-primary (main content)
- Borders: border border-border (standard), border-t border-border (dividers)
- Focus states: focus:ring-2 focus:ring-primary focus:border-primary

COMPONENT PATTERNS:
- Buttons: px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded transition-colors
- Cards: bg-white rounded-lg shadow-md p-6 border border-border
- Forms: w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition
- Status indicators: inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success

VALIDATION:
- Before completing, verify no hardcoded colors are used
- Ensure all colors use design tokens
- Check hover states use token variants
- Verify focus states are accessible

Reference: docs/frontend/STYLING_SYSTEM_GUIDE.md
```

### **For Component Updates**

```
You are updating an existing React component in the Hive application.

STYLING MIGRATION REQUIREMENTS:
- Identify any hardcoded colors (bg-blue-*, text-green-*, bg-gray-*, etc.)
- Replace with appropriate design tokens
- Maintain visual consistency with existing components
- Preserve all functionality and accessibility

MIGRATION PATTERNS:
- bg-blue-600 → bg-primary
- bg-green-600 → bg-success
- text-gray-900 → text-text-primary
- text-gray-600 → text-text-secondary
- bg-gray-50 → bg-secondary
- border-gray-200 → border-border
- hover:bg-blue-700 → hover:bg-primary-hover
- focus:ring-blue-500 → focus:ring-primary

VALIDATION STEPS:
1. Find hardcoded colors: grep -r "bg-blue-\|bg-green-\|bg-gray-\|text-blue-\|text-green-\|text-gray-" [component-file]
2. Map to design tokens using the patterns above
3. Test visual consistency
4. Verify accessibility compliance

Reference: docs/frontend/STYLING_SYSTEM_GUIDE.md
```

### **For Feature Development**

```
You are developing a new feature for the Hive application.

STYLING INTEGRATION REQUIREMENTS:
- All new components must use the unified styling system
- Follow established design patterns from existing features
- Ensure consistency with the overall application design
- Maintain brand alignment and accessibility

DESIGN SYSTEM INTEGRATION:
- Use semantic design tokens for all colors
- Follow component patterns from similar features
- Implement proper hover and focus states
- Ensure responsive design with consistent spacing

FEATURE-SPECIFIC PATTERNS:
- Navigation: Use GlobalNav and Header patterns
- Forms: Use SharedCampaignForm patterns
- Modals: Use SharedModal patterns
- Buttons: Use SharedActionButtons patterns
- Progress: Use SharedProgressPanel patterns

VALIDATION CHECKLIST:
- [ ] No hardcoded colors in any new components
- [ ] All components use design tokens
- [ ] Visual consistency with existing features
- [ ] Accessibility compliance verified
- [ ] Responsive design implemented
- [ ] Brand alignment maintained

Reference: docs/frontend/STYLING_SYSTEM_GUIDE.md
```

## 🔧 **Usage Instructions**

### **For Developers**

1. **Copy the appropriate prompt** based on your task
2. **Paste it at the beginning** of your development request
3. **Include specific requirements** for your component/feature
4. **Reference existing components** for patterns

### **Example Usage**

```
[PROACTIVE STYLING PROMPT]

Create a new UserProfile component that displays:
- User avatar and name
- Email and role information
- Edit profile button
- Account settings link

The component should:
- Use the unified styling system
- Follow patterns from existing profile components
- Be responsive and accessible
- Include proper hover and focus states
```

### **For Code Reviews**

```
[STYLING VALIDATION]

Please review this component for styling compliance:

CHECKLIST:
- [ ] No hardcoded colors (bg-blue-*, text-green-*, etc.)
- [ ] All colors use design tokens (bg-primary, text-text-primary, etc.)
- [ ] Hover states use token variants (hover:bg-primary-hover)
- [ ] Focus states are accessible (focus:ring-primary)
- [ ] Visual consistency with existing components
- [ ] Brand alignment maintained

VALIDATION COMMAND:
grep -r "bg-blue-\|bg-green-\|bg-gray-\|text-blue-\|text-green-\|text-gray-" [component-file]
```

## 📚 **Reference Materials**

### **Design Token Quick Reference**

| Purpose         | Token                               | Example                                                             |
| --------------- | ----------------------------------- | ------------------------------------------------------------------- |
| Primary buttons | `bg-primary hover:bg-primary-hover` | `<button className="bg-primary hover:bg-primary-hover text-white">` |
| Success actions | `bg-success hover:bg-success-hover` | `<button className="bg-success hover:bg-success-hover text-white">` |
| Main headings   | `text-text-primary`                 | `<h1 className="text-text-primary">`                                |
| Body text       | `text-text-secondary`               | `<p className="text-text-secondary">`                               |
| Helper text     | `text-text-muted`                   | `<span className="text-text-muted">`                                |
| Containers      | `bg-secondary`                      | `<div className="bg-secondary">`                                    |
| Borders         | `border border-border`              | `<div className="border border-border">`                            |
| Focus states    | `focus:ring-primary`                | `focus:ring-2 focus:ring-primary focus:border-primary`              |

### **Component Pattern Examples**

```jsx
// Button Pattern
<button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded transition-colors">
  Action
</button>

// Card Pattern
<div className="bg-white rounded-lg shadow-md p-6 border border-border">
  <h2 className="text-xl font-bold text-text-primary mb-4">Title</h2>
  <p className="text-text-secondary">Content</p>
</div>

// Form Input Pattern
<input
  className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
  placeholder="Enter text..."
/>

// Status Badge Pattern
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success">
  ✓ Active
</span>
```

## 🎯 **Success Metrics**

### **Proactive Implementation**

- ✅ **0 hardcoded colors** in new components
- ✅ **100% design token usage** from development start
- ✅ **Consistent visual language** across all new features
- ✅ **Reduced migration effort** for future updates

### **Quality Assurance**

- ✅ **Brand consistency** maintained
- ✅ **Accessibility compliance** built-in
- ✅ **Developer efficiency** improved
- ✅ **Code maintainability** enhanced

## 🚀 **Continuous Improvement**

### **Prompt Evolution**

- Update based on new design patterns
- Incorporate feedback from developers
- Add new token references as needed
- Improve clarity and specificity

### **Team Adoption**

- Share successful implementations
- Document new patterns discovered
- Provide training on prompt usage
- Celebrate consistent styling achievements

---

**Remember**: Using this proactive prompt ensures that every new component follows the unified styling system from day one, eliminating the need for future migrations and maintaining design consistency across the entire application.
