package com.timetable.service.detector;

import com.timetable.model.ConflictViolation;
import com.timetable.model.ScheduleEntry;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * High-performance conflict detection engine.
 * Coordinates all modular ConflictRules to evaluate candidate slots against scheduled timetables.
 */
public class ConflictDetector {
    private final List<ConflictRule> rules;

    public ConflictDetector() {
        this.rules = new ArrayList<>();
        // Register default conflict detection strategies
        this.rules.add(new TeacherOverlapRule());
        this.rules.add(new RoomOverlapRule());
        this.rules.add(new SectionOverlapRule());
        this.rules.add(new CapacityRule());
    }

    public ConflictDetector(List<ConflictRule> customRules) {
        this.rules = new ArrayList<>(customRules);
    }

    /**
     * Validates a candidate entry against an existing collection of scheduled entries.
     * @param candidate The entry to be placed in the timetable.
     * @param existingEntries Current active timetable records.
     * @return List of detected conflicts. Empty list indicates 0 conflicts (valid schedule).
     */
    public List<ConflictViolation> detectConflicts(ScheduleEntry candidate, List<ScheduleEntry> existingEntries) {
        if (candidate == null) {
            return Collections.emptyList();
        }

        List<ConflictViolation> violations = new ArrayList<>();

        // 1. Check self-contained rules (like capacity constraint)
        for (ConflictRule rule : rules) {
            if (rule instanceof CapacityRule) {
                Optional<ConflictViolation> capacityCheck = rule.checkConflict(candidate, null);
                capacityCheck.ifPresent(violations::add);
            }
        }

        if (existingEntries == null || existingEntries.isEmpty()) {
            return violations;
        }

        // 2. Check relational interval-overlap rules against each existing entry
        for (ScheduleEntry existing : existingEntries) {
            for (ConflictRule rule : rules) {
                if (!(rule instanceof CapacityRule)) {
                    Optional<ConflictViolation> violation = rule.checkConflict(candidate, existing);
                    violation.ifPresent(violations::add);
                }
            }
        }

        return violations;
    }

    /**
     * Scans an entire timetable and audits all pairwise clashes.
     */
    public List<ConflictViolation> auditEntireTimetable(List<ScheduleEntry> allEntries) {
        if (allEntries == null || allEntries.size() < 2) {
            return Collections.emptyList();
        }

        List<ConflictViolation> auditResults = new ArrayList<>();
        int n = allEntries.size();

        for (int i = 0; i < n; i++) {
            ScheduleEntry entryA = allEntries.get(i);
            for (int j = i + 1; j < n; j++) {
                ScheduleEntry entryB = allEntries.get(j);
                for (ConflictRule rule : rules) {
                    if (!(rule instanceof CapacityRule)) {
                        rule.checkConflict(entryA, entryB).ifPresent(auditResults::add);
                    }
                }
            }
        }

        return auditResults;
    }
}
